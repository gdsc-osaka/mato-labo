import {NextRequest, NextResponse} from "next/server";
import {DisciplineRepository} from "@/repository/disciplineRepository";

const disciplineRepository = new DisciplineRepository();

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const results = await disciplineRepository.findMany();
        return NextResponse.json(results);
    } catch (e) {
        return new NextResponse("Internal server error happened.", {status: 500})
    }
}
