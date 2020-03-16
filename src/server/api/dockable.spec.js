/**
 * /server/api/dockable.spec.js
 * 
 * @description Test api dockable endpoints
 */

const cache = require("../cache/cache");
const { DOCKABLE_MESSAGE, NOT_DOCKABLE_MESSAGE } = require("./messages");
const mock = require("../../test/mock.json");

const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);

describe("Test dockable endpoints", () => {
    let response;

    beforeEach(() => {
        cache.write("/stations", mock);
    });

    afterEach(() => {
        cache.clear();
    });

    describe("GET /dockable/:stationid/:bikestoreturn", () => {
        let expected;

        it("Success response: dockable true", async done => {
            expected = {
                dockable: true,
                message: DOCKABLE_MESSAGE(12, 402, "There are total of 14 available docks at this station.")
            };
            response = await request.get("/dockable/402/12");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expected);
            done();
        });

        it("Success response: dockable false", async done => {
            expected = {
                dockable: false,
                message: NOT_DOCKABLE_MESSAGE(20, 402, "You can only dock 14 bikes at this station. Please find other stations if you wish to dock all the bikes in one station or distribute them amongst multiple stations.")
            };
            response = await request.get("/dockable/402/20");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expected);
            done();
        });

        it("Failed response: bad parameters", async done => {
            response = await request.get("/dockable/hello/testing");
            expect(response.status).toBe(500);
            done();
        });
    });
});
