import {IBrowser} from "@/crawler/browser";

class UnivScraper {
    constructor(private browser: IBrowser) {}

    private async searchGoogle(q: string) {
        const query = new URLSearchParams({q});
        const resultClassName = "yuRUbf";

        try {
            await this.browser.launch(new URL(`https://www.google.com/search?${query.toString()}`))
            await this.browser.$class(resultClassName);
            return this.browser.currentUrl();
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async searchUnivUrls(univName: string) {
        const graduateSchoolUrl = await this.searchGoogle(`${univName} 大学院`);
        if (!graduateSchoolUrl) return;
        const univUrl = graduateSchoolUrl.origin;

    }
}
