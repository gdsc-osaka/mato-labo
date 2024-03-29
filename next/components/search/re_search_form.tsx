'use client'

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import SelectRegion from "@/components/search/select_region";
import SelectPrefecture from "@/components/search/select_pref";
import {SearchParams} from "@/app/search/page";
import {FormEvent} from "react";
import {useRouter} from "next/navigation";
import {removeEmptyFields} from "@/lib/object_utils";

export default function ReSearchForm({defaultValue}: {
    defaultValue: SearchParams
}) {
    const router = useRouter();

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const params: SearchParams = {
            q: formData.has('keyword') ? formData.get('keyword') as string : undefined,
            dis: formData.has('discipline') ? formData.get('discipline') as string : undefined,
            pref: formData.has('prefecture') ? formData.get('prefecture') as string : undefined,
            region: formData.has('region') ? formData.get('region') as string : undefined,
        }

        router.push(`/search?${new URLSearchParams(removeEmptyFields(params)).toString()}`)
    }

    return (
        <form className={'bg-card flex flex-col gap-6'} onSubmit={handleSearch}>
            <Input placeholder={'フリーワード検索'} defaultValue={defaultValue.q} name={'keyword'}
                   label={<Label htmlFor={'free-word-search'}>フリーワード検索</Label>}/>
            <Input placeholder={'学問分野で検索'} name={'discipline'}
                   label={<Label htmlFor={'discipline-search'}>学問分野で検索</Label>}/>
            <SelectRegion name={'region'} defaultValue={defaultValue.region}/>
            <SelectPrefecture name={'prefecture'} defaultValue={defaultValue.pref}/>
            <div className={'flex flex-row justify-end'}>
                <button type={'submit'}>
                    再検索
                </button>
            </div>
        </form>
    );
};
