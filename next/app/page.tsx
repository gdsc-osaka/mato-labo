import {SearchBox} from "@/components/search";
import {scrapeLaboratoryWebsite, scrapeResearchMap, LaboWebsite, scrapeAbstract} from "@/crawler/scraper";
import {PaperData} from "@/crawler/types";

export default function Home() {
    async function testAction() {
        'use server';

        // const laboWebsite = await scrapeLaboratoryWebsite(new URL("https://www-mura.ist.osaka-u.ac.jp/"));
        // console.log("[Scrape] " + JSON.stringify(laboWebsite,null,'  '));
        // const professor = laboWebsite?.member.staff.find(m => m.position === "教授");
        // if (!professor) {
        //     console.error("[Scrape] Couldn't find professor");
        //     return;
        // }
        // const affiliationName = "大阪大学";
        // const researchMap = await scrapeResearchMap(professor.name, affiliationName);
        // console.log("[Scrape] " + JSON.stringify(researchMap,null,'  '));

        const paperUrls = ["https://ieeexplore.ieee.org/document/10445111"];
        const papers = new Array<PaperData>();

        for (const paperUrl of paperUrls) {
            const abstract = await scrapeAbstract(paperUrl);
            papers.push({srcUrl: paperUrl, abstract})
        }

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

const exampleLaboJson = "{" +
    "  \"member\": {" +
    "    \"staff\": [" +
    "      {" +
    "        \"name\": \"村田正之\"," +
    "        \"name_en\": \"Masayuki Murata\"," +
    "        \"position\": \"教授\"," +
    "        \"position_en\": \"Professor\"," +
    "        \"email\": \"murata@ist.osaka-u.ac.jp\"" +
    "      }," +
    "      {" +
    "        \"name\": \"長谷川　聡\"," +
    "        \"name_en\": \"Satoshi Hasegawa\"," +
    "        \"position\": \"特任教授\"," +
    "        \"position_en\": \"特任教授\"," +
    "        \"email\": null" +
    "      }," +
    "      {" +
    "        \"name\": \"荒川　慎一\"," +
    "        \"name_en\": \"Shinichi Arakawa\"," +
    "        \"position\": \"特任教授\"," +
    "        \"position_en\": \"特任教授\"," +
    "        \"email\": \"arakawa@ist.osaka-u.ac.jp\"" +
    "      }," +
    "      {" +
    "        \"name\": \"小南　大智\"," +
    "        \"name_en\": \"Daichi Kominiami\"," +
    "        \"position\": \"特任助教\"," +
    "        \"position_en\": \"特任助教\"," +
    "        \"email\": \"kominiami@ist.osaka-u.ac.jp\"" +
    "      }," +
    "      {" +
    "        \"name\": \"岸野　恭彦\"," +
    "        \"name_en\": \"Yoshihiko Kishimo\"," +
    "        \"position\": \"特任助教\"," +
    "        \"position_en\": \"特任助教\"," +
    "        \"email\": \"yoshino@ist.osaka-u.ac.jp\"" +
    "      }," +
    "      {" +
    "        \"name\": \"アルパルサン　オンル\"," +
    "        \"name_en\": \"Alparslan Onur\"," +
    "        \"position\": \"特任助教\"," +
    "        \"position_en\": \"特任助教\"," +
    "        \"email\": \"onur@ist.osaka-u.ac.jp\"" +
    "      }" +
    "    ]," +
    "    \"student\": []" +
    "  }," +
    "  \"access\": {" +
    "    \"post_code\": \"565-0871\"," +
    "    \"address\": \"大阪府吹田市山田丘1-5\"," +
    "    \"tel_number\": \"06-6879-4118\"," +
    "    \"fax\": \"06-6879-4119\"," +
    "    \"access\": [" +
    "      \"大阪モノレール　阪大病院前駅　下車　徒歩15分\"," +
    "      \"阪急バス　阪大本部前バス停　下車　徒歩5分\"" +
    "    ]" +
    "  }" +
    "}";
