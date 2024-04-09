import {Prisma, InstitutionType as RawInstitutionType} from "@prisma/client";
import { z } from 'zod'

export type ForCreate<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
export type ForUpdate<T extends {id: unknown}> = Partial<Omit<T, "createdAt" | "updatedAt">> & {
    id: Pick<T, "id">["id"]
};

const InstitutionTypeSchema = z.nativeEnum(RawInstitutionType);
export type InstitutionType = z.infer<typeof InstitutionTypeSchema>;

export type University = Prisma.UniversityGetPayload<{}>;

export type Laboratory = Prisma.LaboratoryGetPayload<{
    include: {university: true, graduateSchool: true, major: true, discipline: true, tags: true}
}>

export type RawLaboratory = Prisma.LaboratoryGetPayload<{}>;

export type GraduateSchool = Prisma.GraduateSchoolGetPayload<{}>;

export type Major = Prisma.MajorGetPayload<{}>;

export type Discipline = Prisma.DisciplineGetPayload<{}>;

export type Tag = Prisma.TagGetPayload<{}>;

export type RawScholar = Prisma.ScholarGetPayload<{}>;
export type Scholar = Prisma.ScholarGetPayload<{
    include: {laboratory: true}
}>;

export type RawPaper = Prisma.PaperGetPayload<{}>;
