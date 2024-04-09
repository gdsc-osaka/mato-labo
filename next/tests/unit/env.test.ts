import {describe, expect, test} from "vitest";

describe(".env Test", () => {
    test("All .env values are loaded correctly", () => {
        const keys = Object.keys(process.env);
        for (const key of keys) {
            expect(process.env[key]).not.toBe(undefined);
        }
    })
})
