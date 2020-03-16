/**
 * /server/api/messages.spec.js
 * 
 * @description Test api messages methods
 */

const { dockableMsg } = require("./messages");

describe("Test messages functions", () => {
    describe("dockableMsg method", () => {
        it("correctly formats dockable message string", () => {
            const template = dockableMsg`${"bikeCount"} - ${"stationId"} - ${"reason"}`
            const bikeCount = 1;
            const stationId = 1234;
            const reason = "Testing works";

            const expected = "1 - 1234 - Testing works";
            const actual = template(bikeCount, stationId, reason);
            expect(actual).toBe(expected);
        });
    });
});
