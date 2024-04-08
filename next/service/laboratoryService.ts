import {ILaboratoryRepository} from "@/repository/laboratoryRepository";
import {IScholarRepository} from "@/repository/scholarRepository";
import {
    findPaperUrls,
    findResearchMapId,
    scrapeAbstract,
    scrapeLaboratoryWebsite,
    summarizeAbstracts
} from "@/crawler/scraper";
import {Laboratory, RawScholarForCreate} from "@/domain/types";

export interface ILaboratoryService {
    updateLaboratory(laboId: string): Promise<void>;
}

export class LaboratoryService implements ILaboratoryService {
    constructor(
        private laboratoryRepository: ILaboratoryRepository,
        private scholarRepository: IScholarRepository
    ) {}

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
            if (memberData) {
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

            if (professor && professor.researchMapId) {
                const paperUrls = await findPaperUrls(professor.researchMapId);
                const abstracts: string[] = []

                for (const paperUrl of paperUrls) {
                    const abstract = await scrapeAbstract(paperUrl);
                    abstracts.push(abstract);
                }

                const summarize = await summarizeAbstracts(abstracts);

                if (summarize) {
                    newLaboData.paperSummary_ja = summarize.summary_jp;
                    newLaboData.paperSummary_en = summarize.summary_en;
                }
            }

            await this.scholarRepository.createMany(scholars);
        } catch (e) {

        }
    }
}
