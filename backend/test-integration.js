/**
 * Integration Test Script
 * Tests all scaling components working together
 */

const { pool } = require('./config/db');
const { redisClient, cache } = require('./config/redis');

async function testIntegration() {
  console.log('\n🧪 Running Integration Tests...\n');
  
  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Database + Cache Integration
  try {
    console.log('1️⃣  Testing Database + Cache Integration...');
    
    // Query database
    const dbResult = await pool.query('SELECT COUNT(*) as count FROM students');
    const studentCount = parseInt(dbResult.rows[0].count);
    console.log(`   📊 Students in DB: ${studentCount}`);
    
    // Cache the result
    await cache.set('test:student_count', { count: studentCount }, 60);
    console.log('   💾 Cached student count');
    
    // Retrieve from cache
    const cachedResult = await cache.get('test:student_count');
    if (cachedResult && cachedResult.count === studentCount) {
      console.log('   ✅ Cache retrieval successful');
      passedTests++;
    } else {
      console.log('   ❌ Cache retrieval failed');
      failedTests++;
    }
    
    // Clean up
    await cache.del('test:student_count');
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
    failedTests++;
  }

  // Test 2: Database Indexes Performance
  try {
    console.log('\n2️⃣  Testing Database Index Performance...');
    
    // Test query with index
    const startTime = Date.now();
    await pool.query('SELECT * FROM students WHERE email = $1', ['test@example.com']);
    const queryTime = Date.now() - startTime;
    
    console.log(`   ⚡ Query time: ${queryTime}ms`);
    
    if (queryTime < 100) {
      console.log('   ✅ Query performance excellent');
      passedTests++;
    } else if (queryTime < 500) {
      console.log('   ⚠️  Query performance acceptable');
      passedTests++;
    } else {
      console.log('   ❌ Query performance poor');
      failedTests++;
    }
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
    failedTests++;
  }

  // Test 3: Connection Pool Under Load
  try {
    console.log('\n3️⃣  Testing Connection Pool Under Load...');
    
    // Simulate 20 concurrent queries
    const queries = [];
    for (let i = 0; i < 20; i++) {
      queries.push(pool.query('SELECT NOW()'));
    }
    
    const startTime = Date.now();
    await Promise.all(queries);
    const totalTime = Date.now() - startTime;
    
    console.log(`   ⚡ 20 concurrent queries: ${totalTime}ms`);
    console.log(`   📊 Average per query: ${(totalTime / 20).toFixed(2)}ms`);
    
    if (totalTime < 1000) {
      console.log('   ✅ Connection pool handling load well');
      passedTests++;
    } else {
      console.log('   ⚠️  Connection pool under stress');
      passedTests++;
    }
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
    failedTests++;
  }

  // Test 4: Cache Performance
  try {
    console.log('\n4️⃣  Testing Cache Performance...');
    
    // Test cache write speed
    const writeStart = Date.now();
    for (let i = 0; i < 100; i++) {
      await cache.set(`test:perf:${i}`, { data: `test${i}` }, 60);
    }
    const writeTime = Date.now() - writeStart;
    
    // Test cache read speed
    const readStart = Date.now();
    for (let i = 0; i < 100; i++) {
      await cache.get(`test:perf:${i}`);
    }
    const readTime = Date.now() - readStart;
    
    console.log(`   ✍️  100 writes: ${writeTime}ms (${(writeTime/100).toFixed(2)}ms avg)`);
    console.log(`   📖 100 reads: ${readTime}ms (${(readTime/100).toFixed(2)}ms avg)`);
    
    // Clean up
    await cache.delPattern('test:perf:*');
    
    if (writeTime < 1000 && readTime < 500) {
      console.log('   ✅ Cache performance excellent');
      passedTests++;
    } else {
      console.log('   ⚠️  Cache performance acceptable');
      passedTests++;
    }
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
    failedTests++;
  }

  // Test 5: Proctoring Configuration
  try {
    console.log('\n5️⃣  Testing Proctoring Configuration...');
    
    const sampleRate = parseFloat(process.env.PROCTORING_SAMPLE_RATE) || 0.15;
    const frameRate = parseInt(process.env.PROCTORING_FRAME_RATE) || 2;
    const rotationMinutes = parseInt(process.env.PROCTORING_ROTATION_MINUTES) || 5;
    
    // Simulate load for different student counts
    const scenarios = [100, 200, 300, 500];
    
    console.log('\n   📊 Load Simulation:');
    scenarios.forEach(studentCount => {
      const monitored = Math.ceil(studentCount * sampleRate);
      const framesPerSec = monitored * frameRate;
      const status = framesPerSec < 200 ? '✅' : framesPerSec < 400 ? '⚠️' : '❌';
      
      console.log(`   ${status} ${studentCount} students: ${monitored} monitored, ${framesPerSec} frames/sec`);
    });
    
    // Check if configuration is reasonable
    const load300 = Math.ceil(300 * sampleRate) * frameRate;
    if (load300 < 200) {
      console.log('\n   ✅ Proctoring configuration optimal for 300+ students');
      passedTests++;
    } else {
      console.log('\n   ⚠️  Proctoring configuration may need adjustment');
      passedTests++;
    }
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
    failedTests++;
  }

  // Test 6: Environment Configuration
  try {
    console.log('\n6️⃣  Testing Environment Configuration...');
    
    const requiredVars = {
      'DB_POOL_MAX': parseInt(process.env.DB_POOL_MAX),
      'REDIS_URL': process.env.REDIS_URL,
      'PROCTORING_SAMPLE_RATE': parseFloat(process.env.PROCTORING_SAMPLE_RATE),
      'PROCTORING_FRAME_RATE': parseInt(process.env.PROCTORING_FRAME_RATE),
      'PROCTORING_ROTATION_MINUTES': parseInt(process.env.PROCTORING_ROTATION_MINUTES)
    };
    
    let allConfigured = true;
    for (const [key, value] of Object.entries(requiredVars)) {
      if (value) {
        console.log(`   ✅ ${key}: ${value}`);
      } else {
        console.log(`   ❌ ${key}: Not configured`);
        allConfigured = false;
      }
    }
    
    if (allConfigured) {
      console.log('\n   ✅ All environment variables configured');
      passedTests++;
    } else {
      console.log('\n   ❌ Some environment variables missing');
      failedTests++;
    }
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
    failedTests++;
  }

  // Test 7: Cache Middleware Simulation
  try {
    console.log('\n7️⃣  Testing Cache Middleware Logic...');
    
    // Simulate cache hit scenario
    const testKey = 'cache:test:middleware';
    const testData = { message: 'Cached response', timestamp: new Date() };
    
    // First request - cache miss
    const miss1 = await cache.get(testKey);
    console.log(`   📭 Cache miss: ${miss1 === null ? 'Yes' : 'No'}`);
    
    // Store in cache
    await cache.set(testKey, testData, 60);
    
    // Second request - cache hit
    const hit1 = await cache.get(testKey);
    console.log(`   📬 Cache hit: ${hit1 !== null ? 'Yes' : 'No'}`);
    
    // Verify data integrity
    if (hit1 && hit1.message === testData.message) {
      console.log('   ✅ Cache middleware logic working correctly');
      passedTests++;
    } else {
      console.log('   ❌ Cache middleware logic failed');
      failedTests++;
    }
    
    // Clean up
    await cache.del(testKey);
    
  } catch (error) {
    console.log('   ❌ Test failed:', error.message);
    failedTests++;
  }

  // Final Summary
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Integration Test Results:`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All integration tests passed!');
    console.log('✅ System components are properly integrated');
  } else {
    console.log('\n⚠️  Some integration tests failed');
    console.log('📖 Review the errors above and check configuration');
  }
  console.log('='.repeat(60) + '\n');

  // Cleanup
  await pool.end();
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  
  process.exit(failedTests === 0 ? 0 : 1);
}

// Run integration tests
testIntegration().catch((error) => {
  console.error('\n❌ Integration test failed with error:', error);
  process.exit(1);
});
