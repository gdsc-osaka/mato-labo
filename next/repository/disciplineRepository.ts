import {Discipline} from "@/domain/types";
import {prisma} from "@/repository/prisma";

interface IDisciplineRepository {
    findMany(): Promise<Discipline[]>;
}

export class DisciplineRepository implements IDisciplineRepository {
     async findMany(): Promise<Discipline[]> {
        try {
            return await prisma.academicDiscipline.findMany();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
