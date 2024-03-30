import {SearchBox} from "@/components/search";
import {takeLaboPageScreenshot} from "@/crawler/laboratoryCrawler";

export default function Home() {
    async function testAction() {
        'use server';
        takeLaboPageScreenshot(new URL("https://sdl.ist.osaka-u.ac.jp/"))
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <SearchBox/>
            <form action={testAction}>
                <button type={"submit"}>Test</button>
            </form>
        </main>
    )
}
