import {laboratoryDecoder} from "@/domain/decoders";
import {Metadata, ResolvingMetadata} from "next";
import {CallIcon, LanguageIcon, MailIcon} from "@/components/ui/icons";
import {Sidebar} from "@/components/labo/sidebar";
import {TagChip} from "@/components/labo/tag";
import {Paper} from "@/components/labo/paper";

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

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const res = await fetch(process.env.URL + `/api/labo/${id}`, {
        method: 'GET',
        next: {revalidate: 10},
    });

    if (!res.ok) {
        return (
            <main>
                研究室が見つかりませんでした
            </main>
        );
    }

    try {
        const json = await res.json();
        const labo = laboratoryDecoder.parse(json);
        return (
            <main className={'px-12 py-6 flex flex-row items-start gap-4'}>
                <div className={'w-full flex flex-col gap-4'}>
                    <h1 className={'text-2xl font-semibold'}>{labo.name} - {labo.seminarName}</h1>
                    <hr/>
                    <div className={'flex flex-row gap-2'}>
                        {/* TODO: Laboratoryにタグ機能を追加 */}
                        <TagChip>{labo.university.name}</TagChip>
                        <TagChip>{labo.course}</TagChip>
                    </div>
                    <Paper className={'p-4 flex flex-col gap-3'}>
                        <h2 className={'text-lg'}>研究内容</h2>
                        <p className={'text-sm text-neutral-700'}>{labo.paperSummary}</p>
                        <p className={'text-xs text-neutral-500'}>
                            注意: こちらの情報は直近3年の論文のAbstractを大規模言語モデルを用いて要約したものです。詳しい内容は引用元論文及び研究室のホームページを参照してください。
                        </p>
                    </Paper>
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
