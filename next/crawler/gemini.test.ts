import {describe, expect, test} from "vitest";
import {extractJsonFromResult} from "@/crawler/gemini";

describe("Gemini Test", () => {
    test("extractJsonFromResult() Test", () => {
        const res = extractJsonFromResult("```json\n" +
            "{\n" +
            "  \"staff\": [\n" +
            "    {\n" +
            "      \"name\": \"村田真哉\",\n" +
            "      \"name_en\": \"Masayuki Murata\",\n" +
            "      \"position\": \"教授\",\n" +
            "      \"position_en\": \"Professor\",\n" +
            "      \"email\": \"murata@ist.osaka-u.ac.jp\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"長谷川　聡\",\n" +
            "      \"name_en\": \"Satoshi Hasegawa\",\n" +
            "      \"position\": \"特任教授\",\n" +
            "      \"position_en\": \"特任教授\",\n" +
            "      \"email\": null\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"荒川　慎一\",\n" +
            "      \"name_en\": \"Shinichi Arakawa\",\n" +
            "      \"position\": \"教授\",\n" +
            "      \"position_en\": \"Professor\",\n" +
            "      \"email\": \"arakawa@ist.osaka-u.ac.jp\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"小南　大智\",\n" +
            "      \"name_en\": \"Daichi Komimi\",\n" +
            "      \"position\": \"特任助教\",\n" +
            "      \"position_en\": \"特任助教\",\n" +
            "      \"email\": \"d-komimin@ist.osaka-u.ac.jp\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"岸野　恭裕\",\n" +
            "      \"name_en\": \"Yasuo Kishino\",\n" +
            "      \"position\": \"准教授\",\n" +
            "      \"position_en\": \"准教授\",\n" +
            "      \"email\": \"ykishino@ist.osaka-u.ac.jp\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"アルパルサン　オンル\",\n" +
            "      \"name_en\": \"Alparslan Onur\",\n" +
            "      \"position\": \"特任助教（主任）\",\n" +
            "      \"position_en\": \"特任助教（主任）\",\n" +
            "      \"email\": \"a-onur@ist.osaka-u.ac.jp\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"student\": []\n" +
            "}\n" +
            "```\n");
        expect(res).toHaveProperty("staff");
    })
})
