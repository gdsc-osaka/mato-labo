import {Browser} from "@/crawler/browser";
import {callAIWithImage, extractJsonFromResult} from "@/crawler/gemini";
import {Access, accessSchema, MemberData, membersDataSchema} from "@/crawler/types";
import {ElementHandle, JSHandle} from "puppeteer";

const memberPrompt =
    "このウェブページのスクリーンショットから，メンバーの情報を次のようなjsonで出力してください．" +
    "Markdownは使わないで，純粋なjsonだけを出力してください． " +
    "該当するデータがない場合は，null を入力してください． " +
    "{ " +
    "  \"staff\": [ " +
    "    { " +
    "      \"name\": \"田中太郎\", " +
    "      \"name_en\": \"Taro Tanaka\", " +
    "      \"position\": \"教授\", " +
    "      \"position_en\": \"Professor\", " +
    "      \"email\": \"taro@example.com\" " +
    "    } " +
    "  ], " +
    "  \"student\": [ " +
    "    { " +
    "      \"name\": \"山田花子\", " +
    "      \"name_en\": \"Hanako Yamada\", " +
    "      \"position\": \"博士前期課程\", " +
    "      \"position_en\": \"Master Course\", " +
    "      \"email\": \"hanako@example.com\" " +
    "    } " +
    "  ] " +
    "}".replaceAll("  ", "");

const accessPrompt =
    "このウェブページのスクリーンショットから，連絡先や住所の情報を次のようなjsonで出力してください．" +
    "Markdownは使わないで，純粋なjsonだけを出力してください．" +
    "該当するデータがない場合は，null を入力してください． " +
    "{" +
    "  \"post_code\": \"123-4567\"," +
    "  \"address\": \"大阪府吹田市山田丘 1-5 大阪大学大学院 情報科学研究科 B棟4階 増澤研究室\"," +
    "  \"tel_number\": \"01-2345-6789\"," +
    "  \"fax\": \"01-2345-6789\"," +
    "  \"access\": [" +
    "    \"大阪モノレール　阪大病院前駅　下車　徒歩15分\"," +
    "    \"阪急バス　阪大本部前バス停　下車　徒歩5分\"" +
    "  ]" +
    "} ".replaceAll("  ", "");

export type LaboWebsite = {
    member: MemberData,
    access: Access
}

export const scrapeLaboratoryWebsite = async (laboUrl: URL): Promise<LaboWebsite | undefined> => {
    const browser = new Browser();

    try {
        await browser.launch(laboUrl);
        console.log("[Crawler] launch complete.")
        await browser.navigate("Members", "Member", "メンバー", "メンバ");
        console.log("[Crawler] navigate to members complete.")
        const membersScreenshot = await browser.screenshot();
        const memberResponse = await callAIWithImage(memberPrompt, membersScreenshot);
        console.log(`[Crawler] AI response: ${memberResponse.response.text()}`)
        const membersJson = extractJsonFromResult(memberResponse.response.text());
        const membersData = membersDataSchema.parse(membersJson);
        console.log(`[Crawler] membersData: ${JSON.stringify(membersData)}`)

        await browser.navigate("Access", "アクセス", "Location", "About");
        console.log("[Crawler] navigate to access complete.")
        const accessScreenshot = await browser.screenshot();
        const accessResponse = await callAIWithImage(accessPrompt, accessScreenshot);
        console.log(`[Crawler] AI response: ${accessResponse.response.text()}`)
        const accessJson = extractJsonFromResult(accessResponse.response.text());
        const accessData = accessSchema.parse(accessJson);
        console.log(`[Crawler] accessData: ${JSON.stringify(accessJson)}`)

        return {member: membersData, access: accessData};

    } catch (e) {
        console.error(`[Crawler] ${e}`);
    } finally {
        await browser.close();
    }
}

export type ResearchMap = {
    id: string,
    paperUrls: string[]
}

export const scrapeResearchMap = async (name: string, affiliation: string): Promise<ResearchMap> => {
    const browser = new Browser();
    const searchParams = new URLSearchParams({name, affiliation});
    const url = `https://researchmap.jp/researchers?${searchParams.toString()}`

    try {
        await browser.launch(new URL(url));
        await browser.navigate(name);
        const scholarUrl = browser.currentUrl();
        const publishedPapersURI = new URL(`${scholarUrl}/published_papers`)
        await browser.goTo(publishedPapersURI);

        const paperElements = await browser.selectAll(".rm-cv-type-myself");
        const researchMapPaperURL = await Promise.all(
            paperElements.map(el => el.$eval("a", (elm) => elm.href))
        );
        const paperUrls = new Array<string>();

        for (const paperUrl of researchMapPaperURL) {
            await browser.goTo(new URL(paperUrl));

            const linkJoho = await browser.selectText("dt", "リンク情報");
            if (!linkJoho) break;
            const parent = await linkJoho.getProperty('parentNode');
            if (parent instanceof ElementHandle) {
                const paperLink = await parent.$eval("a", (elm) => elm.href);
                paperUrls.push(paperLink);
            }
        }
        return {id: scholarUrl.pathname.substring(1), paperUrls: paperUrls};
    } catch (e) {
        console.error(`[Crawler] ${e}`);
        return Promise.reject(e);
    } finally {
        await browser.close();
    }
}
