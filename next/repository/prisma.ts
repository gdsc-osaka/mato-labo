import {Prisma, PrismaClient} from "@prisma/client";
import {DefaultArgs} from "@prisma/client/runtime/library";

// let isConnected = false;
//
// export const prisma = () => {
//     const prisma = new PrismaClient();
//     if (!isConnected) {
//         prisma.$connect();
//         isConnected = true;
//     }
//     return prisma;
// }

export type TransactionPrismaClient =  Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
export const prisma = new PrismaClient();
