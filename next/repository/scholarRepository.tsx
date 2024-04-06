import {RawScholar, RawScholarForCreate} from "@/domain/types";
import {prisma} from "@/repository/prisma";

export interface IScholarRepository {
    findManyByLabo(laboId: string): Promise<RawScholar[]>;
    createMany(scholars: RawScholarForCreate[]): Promise<void>;
}

export class ScholarRepository implements IScholarRepository{
    async createMany(scholars: RawScholarForCreate[]): Promise<void> {
        try {
            await prisma.scholar.createMany({
                data: scholars
            })
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
