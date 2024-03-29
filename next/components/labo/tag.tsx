import {ReactNode} from "react";

export const TagChip = ({children}: {
    children: ReactNode
}) => {
    return (
        <div className={'rounded-full border border-outline bg-card ' +
            'px-2 py-1 text-xs ' +
            'transition-all hover:bg-gray-100 ' +
            'active:bg-gray-200'}>
            #{children}
        </div>
    )
}
