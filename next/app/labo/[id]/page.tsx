import {laboratoryDecoder, scholarsDecoder} from "@/domain/decoders";
import {Metadata, ResolvingMetadata} from "next";
import {Sidebar} from "@/components/labo/sidebar";
import {TagChip} from "@/components/labo/tag";
import Link from "next/link";
import {Scholar} from "@/domain/types";

export async function generateMetadata(
    { params }: {params: { id: string }},
    parent: ResolvingMetadata
): Promise<Metadata> {
    const res = await fetch(process.env.URL + `/api/labo/${params.id}`, {
        method: 'GET',
        next: {revalidate: 10},
    });

    if (!res.ok) {
        return {}
    }

    try {
        const json = await res.json();
        const labo = laboratoryDecoder.parse(json);
        return {title: labo.name}
    } catch (e) {
        console.error(e);
        return {};
    }
}

const fetchScholars = async (laboId: string): Promise<Scholar[]> => {
    const params = new URLSearchParams();
    params.set('labo', laboId);

    try {
        const res = await fetch(process.env.URL + `/api/scholar?${params.toString()}`)
        if (!res.ok) return [];
        const json = await res.json();
        return scholarsDecoder.parse(json);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const laboRes = await fetch(process.env.URL + `/api/labo/${id}`, {
        method: 'GET',
        next: {revalidate: 10},
    });

    if (!laboRes.ok) {
        return (
            <main>
                研究室が見つかりませんでした
            </main>
        );
    }

    try {
        const json = await laboRes.json();
        const labo = laboratoryDecoder.parse(json);
        const scholars = await fetchScholars(id);

        return (
            <main className={'px-24 py-6 flex flex-row items-start gap-4'}>
                <div className={'w-full flex flex-col gap-4'}>
                    <h1 className={'text-2xl font-semibold'}>{labo.name} - {labo.seminarName}</h1>
                    <hr/>
                    <div className={'flex flex-row gap-2'}>
                        {labo.tags.map(tag => (
                            <Link href={`/tags/${tag.tagId}`}>
                                <TagChip>{tag.tagId}</TagChip>
                            </Link>
                        ))}
                    </div>
                    <div className={'p-4 flex flex-col gap-3 paper'}>
                        <h2 className={'text-lg'}>研究内容</h2>
                        <p className={'text-sm text-neutral-700'}>{labo.paperSummary}</p>
                        <p className={'text-xs text-neutral-500'}>
                            注意: こちらの情報は直近3年の論文のAbstractを大規模言語モデルを用いて要約したものです。詳しい内容は引用元論文及び研究室のホームページを参照してください。
                        </p>
                    </div>
                    <div>
                        <h2 className={'text-lg'}>メンバー</h2>
                        {scholars.map(scholar => (
                            <p>{scholar.name}</p>
                        ))}
                    </div>
                    <div>
                        <h2 className={'text-lg'}>研究業績</h2>
                    </div>
                </div>
                <Sidebar {...labo}/>
            </main>
        )

    } catch (e) {
        return (
            <main>
                データが不正です
            </main>
        )
    }
}
