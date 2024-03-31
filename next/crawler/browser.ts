import puppeteer, {Browser as PBrowser, Page} from "puppeteer";

export class Browser {
    private browser: PBrowser | undefined;
    private page: Page | undefined;

    constructor() {}

    async launch(url: URL) {
        try {
            const browser = await puppeteer.launch({
                headless: false,
            });
            this.page = await browser.newPage();
            await this.page.setViewport({ width: 1920, height: 1080 });
            return this.page.goto(url.toString(), {"waitUntil": "domcontentloaded"});
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async navigate(...linkText: string[]) {
        if (this.page === undefined) return Promise.reject("Couldn't navigate because this.page is undefined.");

        try {
             const link = await this.selectTextWithTag("a", ...linkText);

            if (!link) return Promise.reject(`No link found. (${linkText.join(", ")})`);

            await link.click();
            return this.page.waitForNavigation();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    goTo(url: URL) {
        return this.page?.goto(url.toString());
    }

    goBack() {
        if (this.page === undefined) return Promise.reject("this.page is undefined.");
        return this.page.goBack();
    }

    screenshot(full?: boolean) {
        if (this.page === undefined) return Promise.reject("Couldn't take screenshot because this.page is undefined.");
        return this.page.screenshot({ path: `./crawler/screenshot.png`, fullPage: full ?? false });
    }

    close(): Promise<void> {
        if (this.browser === undefined) return Promise.reject("this.browser is undefined.");
        return this.browser.close();
    }

    currentUrl(): URL {
        if (!this.page) throw new Error("this.page is null");
        return new URL(this.page.url());
    }

    selectTextWithTag(tag: string, ...text: string[]) {
        const selector = `::-p-xpath(${text.map(t => `//${tag}[contains(text(), '${t}')]`).join(' | ')})`;
        return this.page?.$(selector)
    }

    currentPage() {
        return this.page;
    }

    selectAll(selector: string) {
        if (!this.page) throw new Error("this.page is null");
        return this.page.$$(selector);
    }
}
