import {z} from "zod";
import {Discipline, Laboratory, University} from "@/domain/types";

export const laboratoryDecoder = z.custom<Laboratory>();
export const laboratoriesDecoder = z.array(laboratoryDecoder);

export const universityDecoder = z.custom<University>();
export const universitiesDecoder = z.array(universityDecoder);

export const disciplineDecoder = z.custom<Discipline>();
export const disciplinesDecoder = z.array(disciplineDecoder);
