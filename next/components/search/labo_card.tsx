import {Laboratory} from "@/domain/types";
import {StarIcon} from "@/components/ui/icons";

export const LaboCard = ({labo}: {labo: Laboratory}) => {
    return (
        <article className={'border border-material-outline rounded p-4 ' +
            'flex flex-col'}>
            <div className={'flex flex-row justify-between items-center'}>
                <p className={'text-lg'}>{labo.name}</p>
                <button className={'transition-all rounded-full p-2 ' +
                    'hover:bg-gray-100 active:bg-gray-200'}>
                    <StarIcon className={'w-5'}/>
                </button>
            </div>
            <p className={'text-base py-2'}>{labo.seminarName}</p>
            <p className={'text-sm'}>{labo.university.name + labo.course}</p>
            <p className={'text-sm'}>{labo.major}</p>
            <a href={labo.websiteUrl} target={"_blank"} rel={"noopener noreferrer"}
               className={'text-sm pt-2 break-all text-link'}>{labo.websiteUrl}</a>
        </article>
    )
}
