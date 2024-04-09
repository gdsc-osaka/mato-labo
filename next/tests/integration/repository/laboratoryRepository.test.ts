import {describe, expect, test} from "vitest";
import {LaboratoryRepository} from "@/repository/laboratoryRepository";
import {Laboratory} from "@/domain/types";

describe("LaboratoryRepository Test", () => {
    const repo = new LaboratoryRepository();
    let laboratories: Laboratory[] = []

    test("findMany()", async () => {
        laboratories = await repo.findMany({});
        expect(laboratories).toHaveLength(1);
    });

    test("findUnique()", async () => {
        const result = await repo.find(laboratories[0].id);
        expect(result).not.toBe(null);
    })
})
