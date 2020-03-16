/**
 * /server/api/utils.spec.js
 * 
 * @description Test api utils methods
 */

const { detectUnsupportedParams, formatStrToNum, isNumeric, matchString } = require("./utils");

describe("Test utils methods", () => {
    describe("formatStrToNum method", () => {
        let numString;

        afterEach(() => {
            numString = "";
        });

        it("returns true if number string is whole number", () => {
            numString = "3124";
            expect(formatStrToNum(numString)).toBe(3124);
        });

        it("throws error if number string is not whole number", () => {
            const expectedErr = new Error("Not a whole number");
            numString = "-31";
            expect(() => {
                formatStrToNum(numString);
            }).toThrow(expectedErr);
        });
    });

    describe("isNumeric method", () => {
        let numString;

        afterEach(() => {
            numString = "";
        });

        it("returns true if number string is whole number", () => {
            numString = "123";
            expect(isNumeric(numString)).toBe(true);
        });

        it("returns false if number string not number", () => {
            numString = "not-a-number";
            expect(isNumeric(numString)).toBe(false);
        });

        it("returns false if number string negative", () => {
            numString = "-1";
            expect(isNumeric(numString)).toBe(false);
        });

        it("returns false if number string float", () => {
            numString = "1.0";
            expect(isNumeric(numString)).toBe(false);
        });
    });

    describe("matchString method", () => {
        let firstString;
        let secondString;

        afterEach(() => {
            firstString = "";
            secondString = "";
        });

        it("returns true if first string is substring of second string", () => {
            firstString = "test";
            secondString = "testing123"

            const result = matchString(firstString, secondString);
            expect(result).toBe(true);
        });

        it("returns false if first string is NOT substring of second string", () => {
            firstString = "tested";
            secondString = "testing123"

            const result = matchString(firstString, secondString);
            expect(result).toBe(false);
        });
    });

    describe("detectUnsupportedParams method", () => {
        const supported = ["test", "test1"];

        it("throws error if detected", () => {
            expect(() => {
                detectUnsupportedParams(supported, { test2: "test2" });
            }).toThrow();
        });
    })
});
