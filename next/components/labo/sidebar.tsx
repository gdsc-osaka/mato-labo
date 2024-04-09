import {ReactNode} from "react";
import {CallIcon, FaxIcon, HomeIcon, LanguageIcon, MailIcon, TrainIcon} from "@/components/ui/icons";

export const Sidebar = ({websiteUrl, email, telNumber, fax, address, access, postCode}: {
    websiteUrl: string | null,
    email: string | null,
    telNumber: string | null,
    fax: string | null,
    address: string | null,
    access: string[],
    postCode: string
}) => {
    return (
        <aside className={'bg-card flex flex-col gap-4 p-4'}>
            {websiteUrl && (
                <SidebarInfoRow icon={<LanguageIcon size={20}/>} label={"ホームページ"}>
                    <a href={websiteUrl} target={"_blank"} rel={"noopener noreferrer"}
                       className={'text-sm link text-nowrap'}>
                        {websiteUrl}
                    </a>
                </SidebarInfoRow>
            )}
            {telNumber && (
                <SidebarInfoRow icon={<CallIcon size={20}/>} label={"電話"}>
                    <p className={'text-sm break-all'}>
                        {telNumber}
                    </p>
                </SidebarInfoRow>
            )}
            {fax && (
                <SidebarInfoRow icon={<FaxIcon size={20}/>} label={"FAX"}>
                    <p className={'text-sm break-all'}>
                        {fax}
                    </p>
                </SidebarInfoRow>
            )}
            {email && (
                <SidebarInfoRow icon={<MailIcon size={20}/>} label={"メール"}>
                    <a href={`mailto:${email}`} target={"_blank"} rel={"noopener noreferrer"}
                       className={'text-sm break-all link'}>
                        {email}
                    </a>
                </SidebarInfoRow>
            )}
            {address && (
                <SidebarInfoRow icon={<HomeIcon size={20}/>} label={"住所"}>
                    <p className={'text-sm break-all max-w-md'}>
                        {address}
                    </p>
                </SidebarInfoRow>
            )}
            {access.length > 0 && (
                <SidebarInfoRow icon={<TrainIcon size={20}/>} label={"アクセス"}>
                    <div className={"flex flex-col"}>
                        {access.map(a => (
                            <p className={'text-sm break-all max-w-md'}>
                                {a}
                            </p>
                        ))}
                    </div>
                </SidebarInfoRow>
            )}
        </aside>
    )
}

export const SidebarInfoRow = (props: {
    icon: ReactNode,
    label: string,
    children: ReactNode
}) => {
    return (
        <div className={'flex flex-row justify-between items-center gap-4'}>
            <div className={'flex flex-row items-center gap-1'}>
                {props.icon}
                <p className={'text-sm text-nowrap'}>{props.label}</p>
            </div>
            {props.children}
        </div>
    )
}
