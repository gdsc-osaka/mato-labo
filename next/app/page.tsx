import {SearchBox} from "@/components/search";
import {scrapeLaboratoryWebsite, ScrapeResult} from "@/crawler/scraper";

export default function Home() {
    async function testAction() {
        'use server';

        const scraperResult = await scrapeLaboratoryWebsite(new URL("https://www-mura.ist.osaka-u.ac.jp/"));
        console.log("[Scrape]" + JSON.stringify(scraperResult,null,'  '));
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
