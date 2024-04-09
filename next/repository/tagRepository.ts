import {ForCreate, Tag} from "@/domain/types";
import {prisma} from "@/repository/prisma";

export interface ITagRepository {
    create(tag: Omit<Tag, "createdAt" | "updatedAt">, laboId: string): Promise<Tag>;
}

export class TagRepository implements ITagRepository {
    create(tag: Omit<Tag, "createdAt" | "updatedAt">, laboId: string, assignedBy?: string): Promise<Tag> {
        try {
            return prisma.laboratory.update({
                where: {
                    id: laboId
                },
                data: {
                    tags: {
                        create: {
                            tag: {
                                create: tag
                            },
                            assignedBy: null,
                        },
                    },
                }
            })
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

}
