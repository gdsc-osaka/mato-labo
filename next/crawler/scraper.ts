import {Browser} from "@/crawler/browser";
import {callAI, callAIWithImage, extractJsonFromResult} from "@/crawler/gemini";
import {Access, accessSchema, MemberData, membersDataSchema} from "@/crawler/types";
import {ElementHandle} from "puppeteer";
import {z, ZodRawShape} from "zod";

const memberPrompt =
    "このウェブページのスクリーンショットから，メンバーの情報を次のようなjsonで出力してください．" +
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

const abstractPrompt = "" +
    "This is a list of abstracts of papers published by a laboratory. Using this list as a reference, please write a statement (300 words or less) that describes the research conducted by this laboratory. Then translate it into Japanese and output both English and Japanese version in json format below.\n" +
    "\n" +
    "json format:\n" +
    "{\n" +
    "  \"summary_en\": \"\",\n" +
    "  \"summary_ja\": \"\"\n" +
    "}\n" +
    "\n" +
    "abstract list:"

export type LaboWebsite = {
    member?: MemberData,
    access?: Access
}

/**
 * 指定されたURLから研究室のデータを取得します．該当する各データがない場合は undefined となります．
 * @param laboUrl 研究室のURL
 */
export const scrapeLaboratoryWebsite = async (laboUrl: URL): Promise<LaboWebsite> => {
    const browser = new Browser();
    let result: LaboWebsite = {};

    try {
        await browser.launch(laboUrl);
        result.member = await navigateAndScrape(browser, memberPrompt, membersDataSchema, "Members", "Member", "メンバー", "メンバ")
        result.access = await navigateAndScrape(browser, accessPrompt, accessSchema, "Access", "アクセス", "Location", "About");
    } catch (e) {
        console.error(`[Crawler] ${e}`);
    } finally {
        await browser.close();
    }

    return result;
}

const navigateAndScrape = async <T extends ZodRawShape>(browser: Browser, prompt: string, schema: z.ZodObject<T>, ...linkTexts: string[]) => {
    try {
        await browser.$texts(...linkTexts);
        console.debug(`[Crawler] navigate to ${linkTexts.join(",")} complete.`)
        const screenshot = await browser.screenshot();
        const res = await callAIWithImage(prompt, screenshot);
        console.debug(`[Crawler] AI response to ${linkTexts[0]}: ${res.response.text()}`)
        const json = extractJsonFromResult(res.response.text());
        const data = schema.parse(json);
        console.debug(`[Crawler] ${linkTexts[0]} data: ${JSON.stringify(data)}`);
        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export type ResearchMap = {
    id: string,
    paperUrls: string[]
}

export const findResearchMapId = async (name: string, affiliation: string): Promise<string | null> => {
    const browser = new Browser();
    const searchParams = new URLSearchParams({name, affiliation});
    const url = `https://researchmap.jp/researchers?${searchParams.toString()}`

    try {
        await browser.launch(new URL(url));
        await browser.$texts(name);
        const scholarUrl = browser.currentUrl();
        return scholarUrl.pathname.substring(1);
    } catch (e) {
        console.error(e);
        return null;
    } finally {
        await browser.close();
    }
}

export const findPaperUrls = async (researchMapId: string) => {
    const browser = new Browser();
    const url = `https://researchmap.jp/${researchMapId}/published_papers`

    try {
        await browser.launch(new URL(url));
        const paperElements = await browser.selectAll(".rm-cv-type-myself");
        const researchMapPaperURL = await Promise.all(
          paperElements.map(el => el.$eval("a", (elm) => elm.href))
        );
        const paperUrls = new Array<string>();

        for (const paperUrl of researchMapPaperURL) {
            await browser.goTo(new URL(paperUrl));

            const linkJoho = await browser.selectTextWithTag("dt", "リンク情報");
            if (!linkJoho) break;
            const parent = await linkJoho.getProperty('parentNode');
            if (parent instanceof ElementHandle) {
                const paperLink = await parent.$eval("a", (elm) => elm.href);
                paperUrls.push(paperLink);
            }
        }
        return paperUrls;
    } catch (e) {
        console.error(`[Crawler] ${e}`);
        return Promise.reject(e);
    } finally {
        await browser.close();
    }
}

export const scrapeAbstract = async (paperUrl: string): Promise<string> => {
    const browser = new Browser();

    try {
        await browser.launch(new URL(paperUrl));
        const page = await browser.currentPage();
        if (!page) return Promise.reject("currentPage() is undefined.");

        const screenshot = await browser.screenshot(true);
        const res = await callAIWithImage(abstractPrompt, screenshot);
        const json = JSON.parse(res.response.text());

        return json.abstract;
    } catch (e) {
        console.error(`[Crawler] ${e}`);
        return Promise.reject(e);
    } finally {
        await browser.close();
    }
}

type AbstractSummary = {
    paperSummary_en: string,
    paperSummary_ja: string
}
const abstractSummarySchema = z.custom<AbstractSummary>();

export const summarizeAbstracts = async (abstractText: string[]) => {
    try {
        const prompt = abstractPrompt + abstractText.map(text => `* ${text}`).join("\n");
        const res = await callAI(prompt);
        console.log(`[AI] response: ${res.response.text()}`)
        const json = JSON.parse(res.response.text());
        return abstractSummarySchema.parse(json);
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
