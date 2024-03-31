import {Browser} from "@/crawler/browser";
import {callAIWithImage, extractJsonFromResult} from "@/crawler/gemini";
import {Access, accessSchema, MemberData, membersDataSchema} from "@/crawler/types";

const memberPrompt = "このウェブページのスクリーンショットから，メンバーの情報を次のようなjsonで出力してください．Markdownは使わないで，純粋なjsonだけを出力してください． " +
    " " +
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
    "} " +
    " " +
    " " +
    "メンバーデータのフィールドに該当るデータがない場合は，null を入力してください．".replaceAll("  ", "");

const accessPrompt = "このウェブページのスクリーンショットから，連絡先や住所の情報を次のようなjsonで出力してください．Markdownは使わないで，純粋なjsonだけを出力してください． " +
    " " +
    "{" +
    "  \"post_code\": \"123-4567\"," +
    "  \"address\": \"大阪府吹田市山田丘 1-5 大阪大学大学院 情報科学研究科 B棟4階 増澤研究室\"," +
    "  \"tel_number\": \"06-6879-4118\"," +
    "  \"fax\": \"06-6879-4119\"," +
    "  \"access\": [" +
    "    \"大阪モノレール　阪大病院前駅　下車　徒歩15分\"," +
    "    \"阪急バス　阪大本部前バス停　下車　徒歩5分\"" +
    "  ]" +
    "}" +
    " " +
    " " +
    "メンバーデータのフィールドに該当るデータがない場合は，null を入力してください．".replaceAll("  ", "");

export type ScrapeResult = {
    member: MemberData,
    access: Access
}

export const scrapeLaboratoryWebsite = async (laboUrl: URL): Promise<ScrapeResult | undefined> => {
    const browser = new Browser();

    try {
        await browser.launch(laboUrl);
        console.log("[Crawler] launch complete.")
        await browser.navigate("Members", "Member", "メンバー", "メンバ");
        console.log("[Crawler] navigate complete.")
        const membersScreenshot = await browser.screenshot();
        console.log("[Crawler] screenshot complete.")
        const memberResponse = await callAIWithImage(memberPrompt, membersScreenshot);
        console.log(`[Crawler] AI response: ${memberResponse.response.text()}`)
        const membersJson = extractJsonFromResult(memberResponse.response.text());
        const membersData = membersDataSchema.parse(membersJson);

        await browser.navigate("Access", "アクセス", "Location", "About");
        const accessScreenshot = await browser.screenshot();
        const accessResponse = await callAIWithImage(accessPrompt, accessScreenshot);
        const accessJson = extractJsonFromResult(accessResponse.response.text());
        const accessData = accessSchema.parse(accessJson);

        return {member: membersData, access: accessData};

    } catch (e) {
        console.error(`[Crawler] ${e}`);
    }
}
