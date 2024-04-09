import {ForCreate, Major} from "@/domain/types";
import {prisma} from "@/repository/prisma";

export interface IMajorRepository {
    create(major: ForCreate<Major>): Promise<Major>;
}

export class MajorRepository implements IMajorRepository {
    create(major: ForCreate<Major>): Promise<Major> {
        try {
            return prisma.major.create({
                data: major
            })
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

}
