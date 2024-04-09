import {ForCreate, GraduateSchool} from "@/domain/types";
import {prisma} from "@/repository/prisma";

export interface IGraduateSchoolRepository {
    create(school: ForCreate<GraduateSchool>): Promise<GraduateSchool>;
}

export class GraduateSchoolRepository implements IGraduateSchoolRepository {
    create(school: ForCreate<GraduateSchool>): Promise<GraduateSchool> {
        try {
            return prisma.graduateSchool.create({
                data: school
            });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }
}
