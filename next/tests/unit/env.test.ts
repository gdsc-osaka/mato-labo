import {describe, expect, test} from "vitest";

describe(".env Test", () => {
    test(".env loads correctly", () => {
        expect(process.env.AI_API_KEY).not.toBe(undefined);
    })
})
