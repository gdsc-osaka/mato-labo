import {Discipline, ForCreate} from "@/domain/types";
import {prisma} from "@/repository/prisma";

interface IDisciplineRepository {
    findMany(): Promise<Discipline[]>;
    create(discipline: ForCreate<Discipline>): Promise<Discipline>;
}

export class DisciplineRepository implements IDisciplineRepository {
     async findMany(): Promise<Discipline[]> {
        try {
            return await prisma.discipline.findMany();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    create(discipline: ForCreate<Discipline>): Promise<Discipline> {
        try {
            return prisma.discipline.create({
                data: discipline
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
