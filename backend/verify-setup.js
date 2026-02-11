/**
 * Setup Verification Script
 * Run this to verify all scaling components are working correctly
 */

const { pool } = require('./config/db');
const { redisClient, cache } = require('./config/redis');

async function verifySetup() {
  console.log('\n🔍 Verifying MCQ Portal Setup...\n');
  
  let allPassed = true;

  // 1. Database Connection
  try {
    console.log('1️⃣  Testing Database Connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('   ✅ Database: Connected');
    console.log(`   📅 Server Time: ${result.rows[0].now}`);
  } catch (error) {
    console.log('   ❌ Database: Failed');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }

  // 2. Database Pool Configuration
  try {
    console.log('\n2️⃣  Checking Database Pool...');
    console.log(`   ✅ Max Connections: ${pool.options.max}`);
    console.log(`   ✅ Min Connections: ${pool.options.min}`);
    console.log(`   ✅ Idle Timeout: ${pool.options.idleTimeoutMillis}ms`);
    console.log(`   ✅ Connection Timeout: ${pool.options.connectionTimeoutMillis}ms`);
  } catch (error) {
    console.log('   ❌ Pool Configuration: Failed');
    allPassed = false;
  }

  // 3. Redis Connection
  try {
    console.log('\n3️⃣  Testing Redis Connection...');
    if (redisClient.isOpen) {
      await redisClient.ping();
      console.log('   ✅ Redis: Connected and responding');
    } else {
      console.log('   ❌ Redis: Not connected');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Redis: Failed');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }

  // 4. Redis Cache Operations
  try {
    console.log('\n4️⃣  Testing Redis Cache Operations...');
    const testKey = 'test:verification';
    const testValue = { message: 'Cache test', timestamp: new Date() };
    
    // Set
    await cache.set(testKey, testValue, 60);
    console.log('   ✅ Cache SET: Working');
    
    // Get
    const retrieved = await cache.get(testKey);
    if (retrieved && retrieved.message === testValue.message) {
      console.log('   ✅ Cache GET: Working');
    } else {
      console.log('   ❌ Cache GET: Failed');
      allPassed = false;
    }
    
    // Delete
    await cache.del(testKey);
    console.log('   ✅ Cache DEL: Working');
  } catch (error) {
    console.log('   ❌ Cache Operations: Failed');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }

  // 5. Database Indexes
  try {
    console.log('\n5️⃣  Checking Database Indexes...');
    const indexQuery = `
      SELECT COUNT(*) as index_count
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%';
    `;
    const result = await pool.query(indexQuery);
    const indexCount = parseInt(result.rows[0].index_count);
    
    if (indexCount > 20) {
      console.log(`   ✅ Performance Indexes: ${indexCount} indexes found`);
    } else {
      console.log(`   ⚠️  Performance Indexes: Only ${indexCount} indexes found`);
      console.log('   💡 Run: node migrations/run-performance-indexes.js');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Index Check: Failed');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }

  // 6. Environment Variables
  console.log('\n6️⃣  Checking Environment Variables...');
  const requiredEnvVars = [
    'DB_POOL_MAX',
    'REDIS_URL',
    'PROCTORING_SAMPLE_RATE',
    'PROCTORING_FRAME_RATE',
    'PROCTORING_ROTATION_MINUTES'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar}: ${process.env[envVar]}`);
    } else {
      console.log(`   ❌ ${envVar}: Not set`);
      allPassed = false;
    }
  }

  // 7. Proctoring Configuration
  console.log('\n7️⃣  Proctoring Configuration...');
  const sampleRate = parseFloat(process.env.PROCTORING_SAMPLE_RATE) || 0.15;
  const frameRate = parseInt(process.env.PROCTORING_FRAME_RATE) || 2;
  const rotationMinutes = parseInt(process.env.PROCTORING_ROTATION_MINUTES) || 5;
  
  console.log(`   ✅ Sample Rate: ${(sampleRate * 100).toFixed(0)}% of students monitored`);
  console.log(`   ✅ Frame Rate: ${frameRate} FPS`);
  console.log(`   ✅ Rotation: Every ${rotationMinutes} minutes`);
  
  // Calculate load for 300 students
  const studentsMonitored = Math.ceil(300 * sampleRate);
  const framesPerSecond = studentsMonitored * frameRate;
  console.log(`   📊 Load for 300 students: ${studentsMonitored} monitored, ${framesPerSecond} frames/sec`);

  // Final Summary
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('🎉 Your system is ready for 300+ concurrent students!');
  } else {
    console.log('⚠️  SOME CHECKS FAILED');
    console.log('📖 Review the errors above and check INSTALLATION_STEPS.md');
  }
  console.log('='.repeat(60) + '\n');

  // Cleanup
  await pool.end();
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Run verification
verifySetup().catch((error) => {
  console.error('\n❌ Verification failed with error:', error);
  process.exit(1);
});
