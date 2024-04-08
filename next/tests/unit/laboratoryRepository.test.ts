import {describe, expect, test} from "vitest";
import {LaboratoryRepository} from "@/repository/laboratoryRepository";

describe("LaboratoryRepository Test", () => {
    const laboratoryRepository = new LaboratoryRepository();

    test("Creates data correctly", async () => {
        const result = await laboratoryRepository.create({
            course: "情報科学研究科",
            disciplineId: 0,
            email: "murata@ist.osaka-u.ac.jp",
            laboType: "DEFAULT",
            major: "コンピュータサイエンス専攻",
            name: "ソフトウェア設計学講座",
            paperSummary: "testtesttest",
            prefectureId: 0,
            seminarName: "楠本研究室",
            telNumber: "06-6879-4540",
            univId: 0,
            websiteUrl: "murata@ist.osaka-u.ac.jp"
        })
        expect(result).toHaveProperty('id');
    });

    test("Find data with prefecture", async () => {
        const osakaPrefId = 27;
        const result = await laboratoryRepository.findMany({prefectureIds: [osakaPrefId]});
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    univId: 0 // 大阪大学を含むか
                })
            ])
        )
    })
});
