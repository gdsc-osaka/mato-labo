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
            const selector = `::-p-xpath(${linkText.map(text => `//a[text()="${text}"]`).join(' | ')})`;
            const link = await this.page.$(selector);

            if (!link) return Promise.reject(`No link found. (${linkText.join(", ")})`);

            await link.click();
            return this.page.waitForNavigation();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    goBack() {
        if (this.page === undefined) return Promise.reject("this.page is undefined.");
        return this.page.goBack();
    }

    screenshot() {
        if (this.page === undefined) return Promise.reject("Couldn't take screenshot because this.page is undefined.");
        return this.page.screenshot({ path: `./crawler/screenshot.png`, fullPage: false });
    }

    close(): Promise<void> {
        if (this.browser === undefined) return Promise.reject("this.browser is undefined.");
        return this.browser.close();
    }
}
