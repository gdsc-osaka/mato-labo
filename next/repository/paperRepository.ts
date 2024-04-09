import {ForCreate, RawPaper} from "@/domain/types";
import {prisma} from "@/repository/prisma";

type Query = {
    laboId?: string,
    scholarId?: string,
}

export interface IPaperRepository {
    findMany(query: Query): Promise<RawPaper[]>;
    createMany(papers: ForCreate<RawPaper>[]): Promise<void>
}

export class PaperRepository implements IPaperRepository {
    findMany(query: Query): Promise<RawPaper[]> {
        try {
            if (query.laboId) {
                return prisma.paper.findMany({
                    where: {
                        scholar: {
                            laboId: query.laboId
                        }
                    }
                })
            }

            if (query.scholarId) {
                return prisma.paper.findMany({
                    where: {
                        scholarId: query.scholarId
                    }
                })
            }

            return prisma.paper.findMany()
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    async createMany(papers: ForCreate<RawPaper>[]): Promise<void> {
        try {
            await prisma.paper.createMany({
                data: papers
            });
            return;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

}
