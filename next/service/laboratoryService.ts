import {ILaboratoryRepository} from "@/repository/laboratoryRepository";
import {IScholarRepository} from "@/repository/scholarRepository";
import {
    findPaperUrls,
    findResearchMapId,
    scrapeAbstract,
    scrapeLaboratoryWebsite,
    summarizeAbstracts
} from "@/crawler/scraper";
import {RawPaperForCreate, RawScholarForCreate} from "@/domain/types";
import {prisma} from "@/repository/prisma";

export interface ILaboratoryService {
    updateLaboratory(laboId: string): Promise<void>;
}

export class LaboratoryService implements ILaboratoryService {
    constructor(
        private laboratoryRepository: ILaboratoryRepository,
        private scholarRepository: IScholarRepository
    ) {
    }

    // TODO: Transactionで処理すべきか?
    async updateLaboratory(laboId: string): Promise<void> {
        try {
            const oldLaboData = await this.laboratoryRepository.find(laboId);

            if (oldLaboData === null) return Promise.reject(`Laboratory not found. (${laboId})`);

            if (oldLaboData.websiteUrl === null) return Promise.reject(`Laboratory.websiteUrl is null. (${laboId})`)

            const url = new URL(oldLaboData.websiteUrl);
            const laboWebsite = await scrapeLaboratoryWebsite(url);
            const memberData = laboWebsite.member;
            const scholars: RawScholarForCreate[] = [];

            // メンバーデータの登録
            if (memberData !== undefined) {
                // スタッフのみ登録
                for (const staff of memberData.staff) {
                    const researchMapId = await findResearchMapId(staff.name, oldLaboData.university.name);
                    scholars.push({
                        laboId: laboId,
                        name_ja: staff.name,
                        name_en: staff.name_en,
                        position_ja: staff.position,
                        position_en: staff.position_en,
                        email: staff.email,
                        telNumber: null,
                        iconUri: null,
                        googleScholarId: null,
                        researchMapId: researchMapId
                    });
                }
            }

            // 教授の論文のみ
            const professor = scholars.find(s => s.position_en === 'professor')
            let paperSummary = {
                paperSummary_ja: oldLaboData.paperSummary_ja,
                paperSummary_en: oldLaboData.paperSummary_en
            }

            // 要約を生成
            const papersMap = new Map<string, RawPaperForCreate[]>();

            if (professor !== undefined && professor.researchMapId !== null) {
                const paperUrls = await findPaperUrls(professor.researchMapId);
                papersMap.set(professor.researchMapId, paperUrls.map(url => ({url})));

                const abstracts: string[] = []
                for (const paperUrl of paperUrls) {
                    const abstract = await scrapeAbstract(paperUrl);
                    abstracts.push(abstract);
                }

                const summary = await summarizeAbstracts(abstracts);

                if (summary !== undefined) {
                    paperSummary = summary;
                }
            }

            const accessData = laboWebsite.access;
            await prisma.$transaction(async tx => {
                const newLaboratory = {
                    id: laboId,
                    access: accessData?.access,
                    postCode: accessData?.post_code,
                    telNumber: accessData?.tel_number,
                    fax: accessData?.fax ?? undefined,
                    address: accessData?.address,
                    paperSummary_ja: paperSummary.paperSummary_ja,
                    paperSummary_en: paperSummary.paperSummary_en,
                };
                await this.laboratoryRepository.update(newLaboratory, tx);
                await this.scholarRepository.createMany(scholars, papersMap, tx);
            })
        } catch (e) {
            console.error(e);
            return;
        }
    }
}
