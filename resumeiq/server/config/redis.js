const Redis = require('ioredis');

let redis;

const connectRedis = () => {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });
    redis.on('connect', () => console.log('✅ Redis Connected'));
    redis.on('error', (err) => console.warn('⚠️ Redis Error (non-fatal):', err.message));
  } catch (err) {
    console.warn('⚠️ Redis not available, caching disabled');
  }
  return redis;
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
