const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.client = null;
    this.isRedisAvailable = false;
    this.memoryCache = new Map(); 
    this.initialize();
  }

  async initialize() {
    try {
      if (process.env.REDIS_URL) {
        this.client = new Redis(process.env.REDIS_URL, {
          retryStrategy: (times) => {
            if (times > 3) {
              console.log('Redis connection failed, falling back to memory cache');
              return null;
            }
            return Math.min(times * 100, 3000);
          },
          maxRetriesPerRequest: 3,
        });

        this.client.on('connect', () => {
          this.isRedisAvailable = true;
        });

        this.client.on('error', (err) => {
          this.isRedisAvailable = false;
        });
      } else {
        console.log('ℹ️  No REDIS_URL provided, using in-memory cache');
      }
    } catch (error) {
      console.log('⚠️  Redis initialization failed, using memory cache:', error.message);
      this.isRedisAvailable = false;
    }
  }

  async get(key) {
    try {
      if (this.isRedisAvailable && this.client) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        const cached = this.memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) {
          return cached.value;
        } else if (cached) {
          this.memoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    try {
      if (this.isRedisAvailable && this.client) {
        await this.client.setex(key, ttlSeconds, JSON.stringify(value));
      } else {
        this.memoryCache.set(key, {
          value,
          expiry: Date.now() + (ttlSeconds * 1000)
        });
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      if (this.isRedisAvailable && this.client) {
        await this.client.del(key);
      } else {
        this.memoryCache.delete(key);
      }
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async delPattern(pattern) {
    try {
      if (this.isRedisAvailable && this.client) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } else {
        const regex = new RegExp(pattern.replace('*', '.*'));
        for (const key of this.memoryCache.keys()) {
          if (regex.test(key)) {
            this.memoryCache.delete(key);
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  }

  async flush() {
    try {
      if (this.isRedisAvailable && this.client) {
        await this.client.flushall();
      } else {
        this.memoryCache.clear();
      }
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  startCleanupInterval() {
    setInterval(() => {
      if (!this.isRedisAvailable) {
        const now = Date.now();
        for (const [key, cached] of this.memoryCache.entries()) {
          if (cached.expiry <= now) {
            this.memoryCache.delete(key);
          }
        }
      }
    }, 60000); 
  }
}

const cacheService = new CacheService();
cacheService.startCleanupInterval();

module.exports = cacheService;
