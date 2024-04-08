import Image from "next/image";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/options";
import {redirect} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default async function Header() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return (
        <header className={'w-full px-6 py-3 flex flex-row items-center justify-between ' +
            'border-b border-outline'}>
            <Link href={'/'}>
                <Image src={'/logo.svg'} alt={'labomato-logo'} width={81.5 * 1.5} height={22 * 1.5}/>
            </Link>
            {user && user.image &&
                <img src={user.image} alt={'user-icon'} width={40} height={40}
                    className={'rounded-full'}/>
            }
            {session === null &&
                <Link href={'/signin'}>
                    <Button>
                        ログイン
                    </Button>
                </Link>
            }
        </header>
    )
}
