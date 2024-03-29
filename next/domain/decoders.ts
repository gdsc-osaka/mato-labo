import {z} from "zod";
import {Laboratory} from "@/domain/types";

export const laboratoryDecoder = z.custom<Laboratory>();
export const laboratoriesDecoder = z.array(laboratoryDecoder);
