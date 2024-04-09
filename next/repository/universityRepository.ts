import {ForCreate, University} from "@/domain/types";
import {prisma} from "@/repository/prisma";

interface IUniversityRepository {
    findMany(): Promise<University[]>;
    create(univ: ForCreate<University>): Promise<University>;
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

    create(univ: ForCreate<University>): Promise<University> {
        try {
            return prisma.university.create({
                data: univ
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
