import {Laboratory} from "@/domain/types";
import {StarIcon} from "@/components/ui/icons";
import Link from "next/link";
import {css} from "@kuma-ui/core";

export const LaboCard = ({labo}: { labo: Laboratory }) => {
    return (
        <article className={'relative border border-outline p-4 paper'}>
            <Link href={`/labo/${labo.id}`}
                  className={css`
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                  `}>
            </Link>
            <div className={'flex flex-row justify-between items-center'}>
                <p className={'text-lg'}>{labo.name}</p>
                <div className={'relative z-10'}>
                    <button className={'transition-all rounded-full p-2 ' +
                        'hover:bg-gray-100 active:bg-gray-200'}>
                        <StarIcon className={'w-5'}/>
                    </button>
                </div>
            </div>
            <p className={'text-outline text-base py-2'}>{labo.seminarName}</p>
            <p className={'text-outline text-sm'}>{labo.university.name + labo.course}</p>
            <p className={'text-outline text-sm'}>{labo.major}</p>
            <div className={'relative z-10'}>
                <a href={labo.websiteUrl} target={"_blank"} rel={"noopener noreferrer"}
                   className={'text-sm pt-2 break-all link'}>
                    {labo.websiteUrl}
                </a>
            </div>
        </article>
    )
}
