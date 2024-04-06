import {prisma} from "@/repository/prisma";
import {Laboratory, RawLaboratory} from "@/domain/types";

type Query = {
    keyword?: string;
    prefectureIds?: number[];
    disciplineIds?: number[];
    tagId?: string;
}

export interface ILaboratoryRepository {
    findMany(query: Query): Promise<Laboratory[]>;
    find(id: string): Promise<Laboratory | null>;
    create(laboratory: Omit<RawLaboratory, "id" | "createdAt" | "updatedAt">): Promise<RawLaboratory>;
}

export class LaboratoryRepository implements ILaboratoryRepository {
    async findMany(query: Query): Promise<Laboratory[]> {
        try {
            return await prisma.laboratory.findMany({
                where: {
                    name: {
                        contains: query.keyword
                    },
                    prefectureId: {
                        in: query.prefectureIds
                    },
                    disciplineId: {
                        in: query.disciplineIds
                    },
                    // tags: {
                    //     some: {
                    //         tag: {
                    //             id: query.tagId
                    //         }
                    //     }
                    // }
                },
                include: {
                    university: true,
                    discipline: true,
                    tags: true,
                },
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    async find(id: string): Promise<Laboratory | null> {
        try {
            return await prisma.laboratory.findUnique({
                where: {
                    id: id
                },
                include: {
                    university: true,
                    discipline: true,
                    tags: true,
                },
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    async create(laboratory: Omit<RawLaboratory, "id" | "createdAt" | "updatedAt">) {
        try {
            return await prisma.laboratory.create({
                data: laboratory
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
