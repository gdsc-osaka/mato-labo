import {NextRequest, NextResponse} from "next/server";
import {LaboratoryRepository} from "@/repository/laboratoryRepository";

const laboratoryRepository = new LaboratoryRepository();

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    const id = params.id;

    if (!id) {
        return new NextResponse("Laboratory ID is required", { status: 400 });
    }

    const result = await laboratoryRepository.find(id);

    if (!result) {
        return new NextResponse("Couldn't find the specified laboratory", { status: 404 })
    }

    return NextResponse.json(result, {status: 200});
}
