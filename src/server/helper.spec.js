/**
 * /server/helper.spec.js
 * 
 * @description Test helper methods
 */


const { getCitiBikeData } = require("./helper");
const { CITIBIKE_DATA_SOURCE_URL } = require("./constants");

describe("Test helper methods", () => {
    describe("getCitiBikeData method", () => {
        it("request successful", async done => {
            const correctUrl = CITIBIKE_DATA_SOURCE_URL;
            const result = await getCitiBikeData(correctUrl);

            expect(typeof result).toBe("object");
            expect(result.length).toBeGreaterThan(0);

            done();
        });

        it("request failure", () => {
            const wrongUrl = "https://feeds.citibikenyc.com/stations/wrongURL.json";
            getCitiBikeData(wrongUrl)
                .catch(e => {
                    expect(e.message).toBe("Request failed with status code 404");
                });
        });
    });
});
