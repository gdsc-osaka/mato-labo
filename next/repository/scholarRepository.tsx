import {ForCreate, RawPaper, RawScholar} from "@/domain/types";
import {prisma, TransactionPrismaClient} from "@/repository/prisma";

export interface IScholarRepository {
    findManyByLabo(laboId: string): Promise<RawScholar[]>;

    /**
     * PaperとScholarを同時にcreateする
     * @param scholars
     * @param papers researchMapId と paper オブジェクト配列の Map
     * @param client Transaction を使うときに PrismaClient を入れる
     */
    createMany(scholars: ForCreate<RawScholar>[], papers: Map<string, ForCreate<RawPaper>[]>, client?: TransactionPrismaClient): Promise<void>;
}

export class ScholarRepository implements IScholarRepository{
    async createMany(scholars: ForCreate<RawScholar>[], papers: Map<string, ForCreate<RawPaper>[]>, client?: TransactionPrismaClient): Promise<void> {
        try {
            const promise = (tx: TransactionPrismaClient) => Promise.all(
                scholars.map(scholar => tx.scholar.create({
                    data: {
                        ...scholar,
                        papers: {
                            create: papers.get(scholar.researchMapId ?? '') ?? []
                        }
                    }
                }))
            );

            if (!client) {
                await prisma.$transaction(tx => promise(tx));
                return;
            }

            await promise(client);
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
    async findManyByLabo(laboId: string): Promise<RawScholar[]> {
        try {
            return await prisma.scholar.findMany({
                where: {
                    laboId: laboId
                },
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
