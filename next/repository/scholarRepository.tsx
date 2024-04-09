import {ForCreate, RawPaper, RawScholar} from "@/domain/types";
import {prisma, TransactionPrismaClient} from "@/repository/prisma";

type Query = {
    laboId?: string,
    scholarId?: string
}

export interface IScholarRepository {
    findMany(query: Query): Promise<RawScholar[]>;
    /**
     * PaperとScholarを同時にcreateする
     * @param scholars
     * @param papers researchMapId と paper オブジェクト配列の Map. PrismaでScholarと一緒にcreateするのでscholarIdは要らない
     * @param client Transaction を使うときに PrismaClient を入れる
     */
    createMany(scholars: ForCreate<RawScholar>[], papers: Map<string, Omit<ForCreate<RawPaper>, "scholarId">[]>, client?: TransactionPrismaClient): Promise<void>;
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
    async findMany(query: Query): Promise<RawScholar[]> {
        try {
            if (query.laboId) {
                return await prisma.scholar.findMany({
                    where: {
                        laboId: query.laboId
                    },
                });
            }

            return await prisma.scholar.findMany();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
