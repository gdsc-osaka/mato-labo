'use client';

import {signIn, signOut} from "next-auth/react";
import Image from "next/image";
import {Button} from "@/components/ui/button";

export const GoogleLoginButton = () => {
    return (
        <button className={'flex flex-row items-center gap-2 py-4 px-8 ' +
            'rounded border border-material-outline-variant transition-all hover:bg-slate-100'}
        onClick={() => signIn('google', {}, { prompt: 'login' })}>
            <Image src={'/google_logo.webp'} alt={'google-icon'} width={20} height={20}/>
            Googleでログイン
        </button>
    );
};

export const LogoutButton = () => {
    return (
        <Button onClick={() => signOut()}>
            ログアウト
        </Button>
    )
}
