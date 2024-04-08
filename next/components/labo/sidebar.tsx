import {ReactNode} from "react";
import {CallIcon, LanguageIcon, MailIcon} from "@/components/ui/icons";

export const Sidebar = ({websiteUrl, email, telNumber}: {
    websiteUrl: string,
    email: string,
    telNumber: string
}) => {
    return (
        <aside className={'bg-card flex flex-col gap-4 p-4'}>
            <SidebarInfoRow icon={<LanguageIcon size={20}/>} label={"ホームページ"}>
                <a href={websiteUrl} target={"_blank"} rel={"noopener noreferrer"}
                    className={'text-sm link text-nowrap'}>
                    {websiteUrl}
                </a>
            </SidebarInfoRow>
            <SidebarInfoRow icon={<CallIcon size={20}/>} label={"電話"}>
                <p className={'text-sm break-all'}>
                    {telNumber}
                </p>
            </SidebarInfoRow>
            <SidebarInfoRow icon={<MailIcon size={20}/>} label={"メール"}>
                <a href={`mailto:${email}`} target={"_blank"} rel={"noopener noreferrer"}
                    className={'text-sm break-all link'}>
                    {email}
                </a>
            </SidebarInfoRow>
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
