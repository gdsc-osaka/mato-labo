import {NextRequest, NextResponse} from "next/server";
import {DisciplineRepository} from "@/repository/disciplineRepository";

const disciplineRepository = new DisciplineRepository();

export async function GET(req: NextRequest): Promise<NextResponse> {
    const params = req.nextUrl.searchParams;
    const results = await disciplineRepository.findMany();

    return NextResponse.json(results);
}
