import {RawScholar} from "@/domain/types";
import {prisma} from "@/repository/prisma";

interface IScholarRepository {
    findManyByLabo(laboId: string): Promise<RawScholar[]>;
}

export class ScholarRepository implements IScholarRepository{
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
