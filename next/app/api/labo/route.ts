import {NextRequest, NextResponse} from "next/server";
import {LaboratoryRepository} from "@/repository/laboratoryRepository";
import {prefUtils} from "@/lib/prefecture_utils";

const laboratoryRepository = new LaboratoryRepository();

export async function GET(request: NextRequest): Promise<NextResponse> {
    const params = request.nextUrl.searchParams;

    const keyword = params.get("q") ?? undefined;
    const disciplineId = Number(params.get("dis"));
    const prefecture = params.get("pref") ?? undefined;
    const region = params.get("region") ?? undefined;
    const tag = params.get("tag") ?? undefined;

    const prefectureIds = new Array<number>();
    if (!isNaN(Number(prefecture))) prefectureIds.push(Number(prefecture));
    if (!isNaN(Number(region))) prefectureIds.push(...prefUtils.getPrefsByRegion(Number(region)).map(p => p.id));

    try {
        const results = await laboratoryRepository.findMany({
            keyword,
            prefectureIds: prefectureIds.length === 0 ? undefined : prefectureIds,
            disciplineIds: isNaN(disciplineId) ? undefined : [disciplineId],
            tagId: tag
        });

        return NextResponse.json(results);
    } catch (e) {
        return new NextResponse("Internal server error happened.", {status: 500});
    }
}
