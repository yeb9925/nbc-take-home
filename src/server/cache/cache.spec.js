/**
 * /server/cache/cache.spec.js
 * 
 * @description Test cache prototype methods
 */

const cache = require("./cache");
cache.capacity = 2; // for testing purposes

describe("Test LRUCache function", () => {
    beforeEach(() => {
        cache.cache.set(0, [{0: "test1"}]);
        cache.cache.set(1, [{1: "test2"}]);
    });

    afterEach(() => {
        cache.cache.clear();
    });

    describe("LRUCache.prototype.read", () => {
        it("returns value and reorders the cache if key exists", () => {
            const firstElementKey = cache.cache.keys().next().value;
            const value = cache.read(firstElementKey);
    
            expect(value).toEqual(cache.cache.get(firstElementKey));
            expect(cache.cache.keys().next().value).not.toBe(firstElementKey);
        });

        it("returns empty array if key not in cache", () => {
            const value = cache.read(2);
            expect(value).toEqual([]);
        });
    });

    describe("LRUCache.prototype.write", () => {
        it("add new key-value to the map", () => {
            cache.write(2, [{2: "test3"}]);
            const value = cache.cache.get(2);
    
            expect(value).toEqual([{2: "test3"}]);
        });

        it("add new key-value to the map and remove LRU if capacity reached", () => {
            const key = cache.cache.keys().next().value;
            cache.write(3, [{3: "test4"}]);
            expect(cache.cache.get(key)).toBeUndefined();
        });
    });

    describe("LRUCache.prototype.clear", () => {
        it("clears the cache", () => {
            cache.clear();
            expect(cache.cache.size).toBe(0);
        });
    });
});
