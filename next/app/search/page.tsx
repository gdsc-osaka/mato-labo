import {z} from 'zod'
import {LaboCard} from "@/components/search/labo_card";
import {Laboratory} from "@/domain/types";
import ReSearchForm from "@/components/search/re_search_form";
import {css} from "@kuma-ui/core";

const laboratoryDecoder = z.custom<Laboratory>();
const laboratoriesDecoder = z.array(laboratoryDecoder);

const searchLaboratories = async (searchParams: SearchParams): Promise<Laboratory[]> => {
    const params = new URLSearchParams(searchParams);
    const res = await fetch(process.env.URL + `/api/labos?${params.toString()}`, {
        method: 'GET',
        next: {revalidate: 10},
    });
    if (!res.ok) {
        return [];
    }
    const json = await res.json();

    try {
        return laboratoriesDecoder.parse(json);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export type SearchParams = {
    q?: string,
    pref?: string,
    region?: string,
    dis?: string,
}

export default async function SearchPage({searchParams}: { searchParams: SearchParams }) {
    const labos = await searchLaboratories(searchParams);

    return (
        <main className={'px-6 py-6 flex flex-row gap-8'}>
            <aside className={'bg-card flex flex-col gap-4 p-4'}>
                <p>詳細検索</p>
                <ReSearchForm defaultValue={searchParams}/>
            </aside>
            <div className={'grid grid-cols-4 gap-2 w-full ' +
                css`
                  grid-template-rows: auto 1fr;
                `}>
                {labos.map(labo => <LaboCard key={labo.id} labo={labo}/>)}
            </div>
        </main>
    );
}
