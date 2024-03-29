import {UniversityRepository} from "@/repository/universityRepository";
import {NextRequest, NextResponse} from "next/server";

const universityRepository = new UniversityRepository();

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const results = await universityRepository.findMany();
        return NextResponse.json(results);
    } catch (e) {
        return new NextResponse("Internal server error happened.", {status: 500});
    }
}
