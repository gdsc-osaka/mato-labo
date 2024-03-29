import {LaboCard} from "@/components/search/labo_card";
import {Discipline, Laboratory} from "@/domain/types";
import ReSearchForm from "@/components/search/re_search_form";
import {css} from "@kuma-ui/core";
import {disciplinesDecoder, laboratoriesDecoder} from "@/domain/decoders";

const searchLaboratories = async (searchParams: SearchParams): Promise<Laboratory[]> => {
    const params = new URLSearchParams(searchParams);
    const res = await fetch(process.env.URL + `/api/labo?${params.toString()}`, {
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

const fetchDisciplines = async (): Promise<Discipline[]> => {
    const res = await fetch(process.env.URL + `/api/discipline`);
    if (!res.ok) {
        return [];
    }
    const json = await res.json();

    try {
        return disciplinesDecoder.parse(json);
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
    tag?: string,
}

export default async function SearchPage({searchParams}: { searchParams: SearchParams }) {
    const labos = await searchLaboratories(searchParams);
    const disciplines = await fetchDisciplines();

    return (
        <main className={'p-6 flex flex-row gap-8'}>
            <aside className={'bg-card flex flex-col gap-4 p-4'}>
                <p>詳細検索</p>
                <ReSearchForm defaultValue={searchParams} disciplines={disciplines}/>
            </aside>
            <div className={'grid grid-cols-4 gap-4 w-full ' +
                css`
                  grid-template-rows: auto 1fr;
                `}>
                {labos.map(labo => <LaboCard key={labo.id} labo={labo}/>)}
            </div>
        </main>
    );
}
