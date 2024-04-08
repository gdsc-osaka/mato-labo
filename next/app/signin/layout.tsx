import {Metadata} from "next";
import {KumaRegistry} from "@kuma-ui/next-plugin/registry";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'ログイン',
    description: 'labomatoにログイン',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className + ' h-screen'}>
                <KumaRegistry>
                    {children}
                </KumaRegistry>
            </body>
        </html>
    )
}
