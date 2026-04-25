class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.startCleanupInterval();
  }

  async get(key) {
    try {
      const cached = this.memoryCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      } else if (cached) {
        this.memoryCache.delete(key);
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    try {
      this.memoryCache.set(key, {
        value,
        expiry: Date.now() + (ttlSeconds * 1000)
      });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      this.memoryCache.delete(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async delPattern(pattern) {
    try {
      const regex = new RegExp(pattern.replace('*', '.*'));
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          this.memoryCache.delete(key);
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
      this.memoryCache.clear();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.memoryCache.entries()) {
        if (cached.expiry <= now) {
          this.memoryCache.delete(key);
        }
      }
    }, 60000);
  }
}

const cacheService = new CacheService();
module.exports = cacheService;
