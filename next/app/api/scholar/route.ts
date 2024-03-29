import {NextRequest, NextResponse} from "next/server";
import {ScholarRepository} from "@/repository/scholarRepository";

const scholarRepository = new ScholarRepository();

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const params = req.nextUrl.searchParams;
        const laboId = params.get("labo");

        if (laboId !== null && laboId !== '') {
            const results = await scholarRepository.findManyByLabo(laboId);
            return NextResponse.json(results);
        }

        // TODO: 必要になったら findMany を実装する
        return NextResponse.json([]);

    } catch (e) {
        return new NextResponse("Internal server error happened.", {status: 500});
    }
}
