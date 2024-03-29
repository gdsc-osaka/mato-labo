import {University} from "@/domain/types";
import {prisma} from "@/repository/prisma";

interface IUniversityRepository {
    findMany(): Promise<University[]>
}

export class UniversityRepository implements IUniversityRepository {
    async findMany(): Promise<University[]> {
        try {
            return await prisma.university.findMany();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
