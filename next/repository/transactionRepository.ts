import {prisma, TransactionPrismaClient} from "@/repository/prisma";

export interface ITransactionRepository {
    transaction(fn: (prisma: TransactionPrismaClient) => Promise<void>): Promise<void>;
}

export class TransactionRepository implements ITransactionRepository {
    transaction(fn: (prisma: TransactionPrismaClient) => Promise<void>): Promise<void> {
        return prisma.$transaction(fn);
    }
}
