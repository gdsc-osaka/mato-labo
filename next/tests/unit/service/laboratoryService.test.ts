import {describe, test} from "vitest";
import {LaboratoryService} from "@/service/laboratoryService";
import {ILaboratoryRepository, Query} from "@/repository/laboratoryRepository";
import {Laboratory, RawLaboratory, RawLaboratoryForUpdate} from "@/domain/types";
import {TransactionPrismaClient} from "@/repository/prisma";

class TestLaboratoryRepository implements ILaboratoryRepository {
    create(laboratory: Omit<RawLaboratory, "id" | "createdAt" | "updatedAt">): Promise<RawLaboratory> {
        return Promise.resolve(undefined);
    }

    find(id: string): Promise<Laboratory | null> {
        return Promise.resolve(undefined);
    }

    findMany(query: Query): Promise<Laboratory[]> {
        return Promise.resolve([]);
    }

    update(laboratory: RawLaboratoryForUpdate, client?: TransactionPrismaClient): Promise<void> {
        return Promise.resolve(undefined);
    }
}

describe("LaboratoryService Test", () => {
    const laboratoryService = new LaboratoryService();

    test("updateLaboratory()", () => {

    })
});
