const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Connect to default 'postgres' db first
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

const createTables = async () => {
    let client;
    try {
        // 1. Create Database if not exists
        client = await pool.connect();
        const dbName = process.env.DB_NAME || 'exam_portal';

        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            console.log(`Creating database '${dbName}'...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Database '${dbName}' created.`);
        } else {
            console.log(`ℹ️ Database '${dbName}' already exists.`);
        }
        client.release();

        // 2. Connect to the actual database
        const dbPool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: dbName,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 5432,
        });

        client = await dbPool.connect();
        console.log(`🔌 Connected to database '${dbName}'...`);

        // 1. Create Students Table
        console.log('Creating students table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                firebase_uid VARCHAR(255) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                roll_number VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Indices for students
        await client.query(`CREATE INDEX IF NOT EXISTS idx_students_firebase_uid ON students(firebase_uid);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);`);

        // 2. Create Admins Table
        console.log('Creating admins table...');
        // Note: Matching schema required by adminAuth.js (email, full_name, password_hash)
        await client.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Seed Default Admin
        const defaultAdminEmail = 'admin@example.com';
        const defaultAdminPassword = 'admin123';
        const defaultAdminName = 'System Admin';

        const adminCheck = await client.query('SELECT * FROM admins WHERE email = $1', [defaultAdminEmail]);

        if (adminCheck.rows.length === 0) {
            console.log(`Seeding default admin (${defaultAdminEmail})...`);
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(defaultAdminPassword, salt);

            await client.query(
                'INSERT INTO admins (email, password_hash, full_name) VALUES ($1, $2, $3)',
                [defaultAdminEmail, hash, defaultAdminName]
            );
            console.log(`✅ Default admin created: ${defaultAdminEmail} / ${defaultAdminPassword}`);
        } else {
            console.log('ℹ️ Default admin already exists.');
        }

        console.log('✅ Database setup completed successfully!');

    } catch (err) {
        console.error('❌ Error setup database:', err);
    } finally {
        if (client) client.release();
        await pool.end(); // Close initial connection
        // Note: dbPool is local to the function scope in the previous chunk, so strictly we should handle it better, 
        // but for a setup script, process exit is fine. 
        process.exit();
    }
};

createTables();
