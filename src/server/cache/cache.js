/**
 * /server/cache/cache.js
 * 
 * @description LRUCache for caching requests as keys and result set as values
 */

const { DEFAULT_CACHE_CAPACITY } = require("../constants");

/**
 * LRUCache constructor
 * @param {number} capacity
 * @returns {void}
 */
function LRUCache(capacity = 200) {
    this.cache = new Map();
    this.capacity = capacity;
};

/**
 * LRUCache write
 * @param {string} key
 * @param {Object[]} value
 * @returns {void}
 */
LRUCache.prototype.write = function(key, value) {
    this.cache.delete(key);
    this.cache.set(key, value);

    // delete least recently updated key if size > capacity
    if(this.cache.size > this.capacity) {
        this.cache.delete(this.cache.keys().next().value);
    }
};

/**
 * LRUCache read
 * @param {string} key
 * @returns {Object[]}
 */
LRUCache.prototype.read = function(key) {
    if(this.cache.has(key)) {
        const value = this.cache.get(key);

        this.cache.delete(key);
        this.cache.set(key, value);
    
        return value;
    }
    return [];
};

/**
 * LRUCache clear cache
 * @returns {void}
 */
LRUCache.prototype.clear = function() {
    this.cache.clear();
};

// Create new LRUCache
const cache = new LRUCache(DEFAULT_CACHE_CAPACITY);

module.exports = cache;
