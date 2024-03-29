import {Prisma, InstitutionType as RawInstitutionType} from "@prisma/client";
import { z } from 'zod'

const InstitutionTypeSchema = z.nativeEnum(RawInstitutionType);
export type InstitutionType = z.infer<typeof InstitutionTypeSchema>;

export type University = Prisma.UniversityGetPayload<{}>;

export type Laboratory = Prisma.LaboratoryGetPayload<{
    include: {university: true, discipline: true}
}>

export type RawLaboratory = Prisma.LaboratoryGetPayload<{}>;

export type Discipline = Prisma.AcademicDisciplineGetPayload<{}>;
