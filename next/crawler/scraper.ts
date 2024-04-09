import {IBrowser} from "@/crawler/browser";
import {callAI, callAIWithImage, extractJsonFromResult} from "@/crawler/gemini";
import {Access, accessSchema, MemberData, membersDataSchema} from "@/crawler/types";
import {ElementHandle} from "puppeteer";
import {z, ZodRawShape} from "zod";

export type LaboWebsite = {
    member?: MemberData,
    access?: Access
}

type AbstractSummary = {
    paperSummary_en: string,
    paperSummary_ja: string
}

const abstractSummarySchema = z.custom<AbstractSummary>();

export interface ILaboratoryScraper {
    scrapeLaboratoryWebsite(laboUrl: URL): Promise<LaboWebsite>;

    findResearchMapId(name: string, affiliation: string): Promise<string | null>;

    findPaperUrls(researchMapId: string): Promise<string[]>;

    scrapeAbstract(paperUrl: URL): Promise<string | undefined>;

    summarizeAbstracts(abstractText: string[]): Promise<AbstractSummary | undefined>;
}

const logger = {
    log(msg: unknown) {
        console.log(`[Scraper:LOG] ${msg}`)
    },
    error(err: unknown) {
        console.error(`[Scraper:ERR] ${err}`);
    }
}

export class LaboratoryScraper implements ILaboratoryScraper {
    constructor(private browser: IBrowser) {
    }

    /**
     * 指定されたURLから研究室のデータを取得します．該当する各データがない場合は undefined となります．
     * @param laboUrl 研究室のURL
     */
    async scrapeLaboratoryWebsite(laboUrl: URL): Promise<LaboWebsite> {
        logger.log("starting scrapeLaboratoryWebsite()");
        let result: LaboWebsite = {};

        try {
            await this.browser.launch(laboUrl);
            result.member = await navigateAndScrape(this.browser, memberPrompt, membersDataSchema, "Members", "Member", "メンバー", "メンバ")
            result.access = await navigateAndScrape(this.browser, accessPrompt, accessSchema, "Access", "アクセス", "Location", "About");
        } catch (e) {
            logger.error(e);
        } finally {
            await this.browser.close();
        }

        return result;
    }

    async findResearchMapId(name: string, affiliation: string): Promise<string | null> {
        logger.log("starting findResearchMapId()");
        const searchParams = new URLSearchParams({name, affiliation});
        const url = `https://researchmap.jp/researchers?${searchParams.toString()}`

        try {
            await this.browser.launch(new URL(url));
            await this.browser.$texts(name);
            const scholarUrl = this.browser.currentUrl();
            return scholarUrl.pathname.substring(1);
        } catch (e) {
            logger.error(e);
            return null;
        } finally {
            await this.browser.close();
        }
    }

    async findPaperUrls(researchMapId: string): Promise<string[]> {
        logger.log("starting findPaperUrls()");
        const url = `https://researchmap.jp/${researchMapId}/published_papers`

        try {
            await this.browser.launch(new URL(url));
            const paperElements = await this.browser.selectAll(".rm-cv-type-myself");
            const researchMapPaperURL = await Promise.all(
                paperElements.map(el => el.$eval("a", (elm) => elm.href))
            );
            const paperUrls = new Array<string>();

            for (const paperUrl of researchMapPaperURL) {
                await this.browser.goTo(new URL(paperUrl));

                const linkJoho = await this.browser.selectTextWithTag("dt", "リンク情報");
                if (!linkJoho) break;
                const parent = await linkJoho.getProperty('parentNode');
                if (parent instanceof ElementHandle) {
                    const paperLink = await parent.$eval("a", (elm) => elm.href);
                    paperUrls.push(paperLink);
                }
            }
            return paperUrls;
        } catch (e) {
            logger.error(e);
            return [];
        } finally {
            await this.browser.close();
        }
    }

    async scrapeAbstract(paperUrl: URL): Promise<string | undefined> {
        logger.log("starting scrapeAbstract()");

        try {
            await this.browser.launch(paperUrl);
            const screenshot = await this.browser.screenshot(true);
            const res = await callAIWithImage(abstractPrompt, screenshot);
            logger.log(`AI Response: ${res.response.text()}`)
            return res.response.text();
        } catch (e) {
            logger.error(e);
            return undefined;
        } finally {
            await this.browser.close();
        }
    }

    async summarizeAbstracts(abstractText: string[]): Promise<AbstractSummary | undefined> {
        logger.log("starting summarizeAbstracts()");
        try {
            const prompt = abstractSummaryPrompt + abstractText.map(text => `* ${text}`).join("\n");
            const res = await callAI(prompt);
            logger.log(`AI Response: ${res.response.text()}`)
            const json = JSON.parse(res.response.text());
            return abstractSummarySchema.parse(json);
        } catch (e) {
            logger.error(e);
            return undefined;
        }
    }

}

const navigateAndScrape = async <T extends ZodRawShape>(browser: IBrowser, prompt: string, schema: z.ZodObject<T>, ...linkTexts: string[]) => {
    try {
        await browser.$texts(...linkTexts);
        const screenshot = await browser.screenshot();
        const res = await callAIWithImage(prompt, screenshot);
        const json = extractJsonFromResult(res.response.text());
        const data = schema.parse(json);
        logger.log(`AI response to ${linkTexts[0]}: ${res.response.text()}`);
        return data;
    } catch (e) {
        logger.error(e);
        return undefined;
    }
}

const memberPrompt =
    "このウェブページのスクリーンショットからメンバーの情報を読み取り，以下のjsonフォーマットで出力してください．" +
    "該当するデータがない場合は，null を入力してください． " +
    "{ " +
    "  \"staff\": [ " +
    "    { " +
    "      \"name_ja\": \"田中太郎\", " +
    "      \"name_en\": \"Taro Tanaka\", " +
    "      \"position_ja\": \"教授\", " +
    "      \"position_en\": \"Professor\", " +
    "      \"email\": \"taro@example.com\" " +
    "    } " +
    "  ], " +
    "  \"student\": [ " +
    "    { " +
    "      \"name_ja\": \"山田花子\", " +
    "      \"name_en\": \"Hanako Yamada\", " +
    "      \"position_ja\": \"博士前期課程\", " +
    "      \"position_en\": \"Master Course\", " +
    "      \"email\": \"hanako@example.com\" " +
    "    } " +
    "  ] " +
    "}".replaceAll("  ", "");

const accessPrompt =
    "このウェブページのスクリーンショットから連絡先と住所の情報を読み取り，以下のjsonフォーマットで出力してください．" +
    "該当するデータがない場合は，null を入力してください．" +
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

const abstractPrompt = "Read and output the Abstract of the paper from the screenshot of this web page."

const abstractSummaryPrompt = "" +
    "This is a list of abstracts of papers published by a laboratory. " +
    "Using this list as a reference, please write a statement (300 words or less) that describes the research conducted by this laboratory. " +
    "Then translate it into Japanese and output both English and Japanese version in json format below. " +
    "日本語訳は丁寧語にしてください．" +
    "\n" +
    "json format:\n" +
    "{\n" +
    "  \"paperSummary_en\": \"\",\n" +
    "  \"paperSummary_ja\": \"\"\n" +
    "}\n" +
    "\n" +
    "abstract list:"
