/**
 * /server/api/stations.spec.js
 * 
 * @description Test api stations endpoints
 */

const cache = require("../cache/cache");
const mock = require("../../test/mock.json");

const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);


describe("Test stations endpoints", () => {
    let response;

    beforeEach(() => {
        cache.write("/stations", mock);
    });

    afterEach(() => {
        cache.clear();
    });

    describe("GET /stations", () => {
        const expected = [
            {
                "stationName": "Broadway & E 22 St",
                "totalDocks": 39,
                "availableBikes": 25,
                "stAddress1": "Broadway & E 22 St"
              },
              {
                "stationName": "5 Ave & E 63 St",
                "totalDocks": 0,
                "availableBikes": 0,
                "stAddress1": "5 Ave & E 63 St"
                },
              {
                "stationName": "Oakland Ave",
                "totalDocks": 26,
                "availableBikes": 10,
                "stAddress1": "Oakland Ave"
              },
              {
                "stationName": "Brunswick St",
                "totalDocks": 22,
                "availableBikes": 4,
                "stAddress1": "Brunswick St"
              }
        ];
        
        it("200 success (without cache)", async done => {
            cache.clear();
            response = await request.get("/stations");
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
            done();
        });

        it("200 success (with cache)", async done => {
            response = await request.get("/stations");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expected);
            done();
        });

        it("200 success with paging", async done => {
            cache.clear();
            response = await request.get("/stations/?page=1");
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(20);
            done();
        });

        it("Failed response", async done => {
            cache.clear();
            response = await request.get("/stations/?page=-1");
            expect(response.status).toBe(500);
            done();
        });
    });

    describe("GET /stations/in-service", () => {
        const expected = [
            {
              "stationName": "Broadway & E 22 St",
              "totalDocks": 39,
              "availableBikes": 25,
              "stAddress1": "Broadway & E 22 St"
            },
            {
              "stationName": "Oakland Ave",
              "totalDocks": 26,
              "availableBikes": 10,
              "stAddress1": "Oakland Ave"
            },
            {
              "stationName": "Brunswick St",
              "totalDocks": 22,
              "availableBikes": 4,
              "stAddress1": "Brunswick St"
            }
        ];

        it("200 success (without cache)", async done => {
            cache.clear();
            response = await request.get("/stations/in-service");
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
            done();
        });

        it("200 success (with cache)", async done => {
            response = await request.get("/stations/in-service");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expected);
            done();
        });

        it("200 success with paging", async done => {
            cache.clear();
            response = await request.get("/stations/in-service/?page=1");
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(20);
            done();
        });

        it("Failed response", async done => {
            cache.clear();
            response = await request.get("/stations/in-service/?page=-1");
            expect(response.status).toBe(500);
            done();
        });
    });

    describe("GET /stations/not-in-service", () => {
        const expected = [
            {
                "stationName": "5 Ave & E 63 St",
                "totalDocks": 0,
                "availableBikes": 0,
                "stAddress1": "5 Ave & E 63 St"
            }
        ];

        it("200 success (without cache)", async done => {
            cache.clear();
            response = await request.get("/stations/not-in-service");
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
            done();
        });

        it("200 success (with cache)", async done => {
            response = await request.get("/stations/not-in-service");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expected);
            done();
        });

        it("200 success with paging", async done => {
            cache.clear();
            response = await request.get("/stations/not-in-service/?page=1");
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(20);
            done();
        });

        it("Failed response", async done => {
            cache.clear();
            response = await request.get("/stations/not-in-service/?page=-1");
            expect(response.status).toBe(500);
            done();
        });
    });

    describe("GET /stations/:searchstring", () => {
        const expected = [
            {
                "stationName": "Broadway & E 22 St",
                "totalDocks": 39,
                "availableBikes": 25,
                "stAddress1": "Broadway & E 22 St"
            }
        ];

        it("200 success match station name and street address", async done => {
            response = await request.get("/stations/Broadway");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expected);
            done();
        });

        it("Empty result", async done => {
            response = await request.get("/stations/testings");
            expect(response.body.length).toBe(0);
            done();
        });
    });

    describe("Save to cache", () => {
        it("Add new response to cache", async done => {
            cache.clear();
            expect(cache.read("/stations").length).toBe(0);
    
            response = await request.get("/stations");
            expect(response.status).toBe(200);
            expect(cache.read("/stations").length).toBeGreaterThan(0);
            done();
        });
    });
});
