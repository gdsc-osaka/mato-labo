import {ILaboratoryRepository} from "@/repository/laboratoryRepository";
import {IScholarRepository} from "@/repository/scholarRepository";
import {ILaboratoryScraper} from "@/crawler/scraper";
import {prisma} from "@/repository/prisma";
import {ITransactionRepository} from "@/repository/transactionRepository";
import {ForCreate, RawPaper, RawScholar} from "@/domain/types";
import {IPaperRepository} from "@/repository/paperRepository";

export interface ILaboratoryService {
    updateLaboratory(laboId: string): Promise<void>;
    updatePaperSummary(laboId: string): Promise<void>;
}

export class LaboratoryService implements ILaboratoryService {
    constructor(
        private laboratoryRepository: ILaboratoryRepository,
        private scholarRepository: IScholarRepository,
        private paperRepository: IPaperRepository,
        private transactionRepository: ITransactionRepository,
        private laboratoryScraper: ILaboratoryScraper,
    ) {
    }

    // TODO: Transactionで処理すべきか?
    async updateLaboratory(laboId: string): Promise<void> {
        try {
            const oldLaboData = await this.laboratoryRepository.find(laboId);

            if (oldLaboData === null) return Promise.reject(`Laboratory not found. (${laboId})`);

            if (oldLaboData.websiteUrl === null) return Promise.reject(`Laboratory.websiteUrl is null. (${laboId})`)

            const url = new URL(oldLaboData.websiteUrl);
            const laboWebsite = await this.laboratoryScraper.scrapeLaboratoryWebsite(url);
            const memberData = laboWebsite.member;
            const scholars: ForCreate<RawScholar>[] = [];

            // メンバーデータの登録
            if (memberData !== undefined && memberData.staff !== null) {
                // スタッフのみ登録
                for (const staff of memberData.staff) {
                    if (staff.name_ja === null) continue;
                    const researchMapId = await this.laboratoryScraper.findResearchMapId(staff.name_ja, oldLaboData.university.name);
                    scholars.push({
                        laboId: laboId,
                        name_ja: staff.name_ja,
                        name_en: staff.name_en,
                        position_ja: staff.position_ja,
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
            // const professor = scholars.find(s => s.position_en === 'Professor')
            // let paperSummary = {
            //     paperSummary_ja: oldLaboData.paperSummary_ja,
            //     paperSummary_en: oldLaboData.paperSummary_en
            // }
            //
            // // 要約を生成
            const papersMap = new Map<string, Omit<ForCreate<RawPaper>, "scholarId">[]>();
            //
            // if (professor !== undefined && professor.researchMapId !== null) {
            //     const paperUrls = await this.laboratoryScraper.findPaperUrls(professor.researchMapId);
            //     papersMap.set(professor.researchMapId, paperUrls.map(url => ({url})));
            //
            //     const abstracts: string[] = []
            //     for (const paperUrl of paperUrls) {
            //         const abstract = await this.laboratoryScraper.scrapeAbstract(paperUrl);
            //         if (abstract) abstracts.push(abstract);
            //     }
            //
            //     const summary = await this.laboratoryScraper.summarizeAbstracts(abstracts);
            //
            //     if (summary !== undefined) {
            //         paperSummary = summary;
            //     }
            // }

            const accessData = laboWebsite.access;
            const newLaboratory = {
                id: laboId,
                access: accessData?.access ?? undefined,
                postCode: accessData?.post_code,
                telNumber: accessData?.tel_number,
                fax: accessData?.fax ?? undefined,
                address: accessData?.address,
                // paperSummary_ja: paperSummary.paperSummary_ja,
                // paperSummary_en: paperSummary.paperSummary_en,
            };
            await this.transactionRepository.transaction(async tx => {
                await this.laboratoryRepository.update(newLaboratory, tx);
                await this.scholarRepository.createMany(scholars, papersMap, tx);
            });
        } catch (e) {
            console.error(e);
            return;
        }
    }

    async updatePaperSummary(laboId: string): Promise<void> {
        try {
            const scholars = await this.scholarRepository.findMany({laboId});
            const professor = scholars.find(s => s.position_en === 'Professor');

            // 要約を生成
            const papersMap = new Map<string, Omit<ForCreate<RawPaper>, "scholarId">[]>();

            if (professor !== undefined && professor.researchMapId !== null) {
                const paperUrls = await this.laboratoryScraper.findPaperUrls(professor.researchMapId);
                papersMap.set(professor.researchMapId, paperUrls.map(url => ({url})));

                const abstracts: string[] = []
                for (const paperUrl of paperUrls) {
                    const abstract = await this.laboratoryScraper.scrapeAbstract(new URL(paperUrl));
                    if (abstract) abstracts.push(abstract);
                }

                const summary = await this.laboratoryScraper.summarizeAbstracts(abstracts);

                if (summary === undefined) return;

                await this.transactionRepository.transaction(async tx => {
                    await this.laboratoryRepository.update({
                        id: laboId,
                        paperSummary_en: summary.paperSummary_en,
                        paperSummary_ja: summary.paperSummary_ja
                    }, tx);
                    const papers = paperUrls.map(url => ({url, scholarId: professor.id}));
                    await this.paperRepository.createMany(papers)
                });
            }
        } catch (e) {
            console.error(e);
            return;
        }
    }
}
