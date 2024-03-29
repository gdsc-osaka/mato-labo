import {z} from "zod";
import {Laboratory} from "@/domain/types";

const laboratoryDecoder = z.custom<Laboratory>();

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const res = await fetch(process.env.URL + `/api/labo/${id}`, {
        method: 'GET',
        next: {revalidate: 10},
    });

    if (!res.ok) {
        return (
            <main>
                研究室が見つかりませんでした
            </main>
        );
    }

    try {
        const json = await res.json();
        const labo = laboratoryDecoder.parse(json);
        return (
            <main>
                {labo.name}
            </main>
        )

    } catch (e) {
        return (
            <main>
                データが不正です
            </main>
        )
    }
}
