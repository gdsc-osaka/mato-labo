import {NextRequest, NextResponse} from "next/server";
import {LaboratoryRepository} from "@/repository/laboratoryRepository";
import {prefUtils} from "@/lib/prefecture_utils";

const laboratoryRepository = new LaboratoryRepository();

export async function GET(request: NextRequest): Promise<NextResponse> {
    const params = request.nextUrl.searchParams;

    const keyword = params.get("q") ?? undefined;
    const discipline = params.get("dis") ?? undefined;
    const prefecture = params.get("pref") ?? undefined;
    const region = params.get("region") ?? undefined;

    const prefectureIds = new Array<number>();
    if (!isNaN(Number(prefecture))) prefectureIds.push(Number(prefecture));
    if (!isNaN(Number(region))) prefectureIds.push(...prefUtils.getPrefsByRegion(Number(region)).map(p => p.id));

    const results = await laboratoryRepository.findMany({
        keyword,
        prefectureIds: prefectureIds.length === 0 ? undefined : prefectureIds
    });

    return NextResponse.json(results);
}
