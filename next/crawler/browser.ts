import puppeteer, {Browser as PBrowser, ElementHandle, HTTPResponse, Page} from "puppeteer";

export interface IBrowser {
    launch(url: URL): Promise<void>
    currentUrl(): URL
    $texts(...linkText: string[]): Promise<void>
    $class(className: string): Promise<void>
    scrollTo(text: string): Promise<void>
    close(): Promise<void>
    selectAll(selector: string): Promise<ElementHandle<Element>[]>
    selectTextWithTag(tag: string, ...text: string[]): Promise<ElementHandle | null>
    goTo(url: URL): Promise<HTTPResponse | null>
    screenshot(full?: boolean): Promise<Buffer>
}

export class Browser implements IBrowser {
    private browser: PBrowser | undefined;
    private page: Page | undefined;

    constructor() {}

    async launch(url: URL) {
        try {
            this.browser = await puppeteer.launch({
                headless: false,
            });
            this.page = await this.browser.newPage();
            await this.page.setViewport({ width: 1920, height: 1080 });
            await this.page.goto(url.toString(), {"waitUntil": "domcontentloaded"});
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     * 入力されたテキストと一致するリンクを探し，そのページに飛びます
     * @param linkText
     */
    async $texts(...linkText: string[]) {
        if (this.page === undefined) return Promise.reject("Couldn't navigate because this.page is undefined.");

        try {
             const link = await this.selectTextWithTag("a", ...linkText);

            if (!link) return Promise.reject(`No link found. (${linkText.join(", ")})`);

            await link.click();
            await this.page.waitForNavigation();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async $class(className: string) {
        if (this.page === undefined) return Promise.reject("Couldn't navigate because this.page is undefined.");

        const selector = `::-p-xpath(//*[@class='${className}'])`;
        try {
            const clazz = await this.page.$(selector);
            if (clazz === null) return Promise.reject('No link found.');
            const link = await clazz.$("//a")
            if (link === null) return Promise.reject('No link found.');
            await link.click();
            await this.page.waitForNavigation();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    goTo(url: URL): Promise<HTTPResponse | null> {
        if (!this.page) throw new Error("this.page is null");
        return this.page.goto(url.toString());
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

    selectTextWithTag(tag: string, ...text: string[]): Promise<ElementHandle | null> {
        if (!this.page) throw new Error("this.page is null");
        const selector = `::-p-xpath(${text.map(t => `//${tag}[contains(text(), '${t}')]`).join(' | ')})`;
        return this.page.$(selector)
    }

    currentPage() {
        return this.page;
    }

    selectAll(selector: string): Promise<ElementHandle[]> {
        if (!this.page) throw new Error("this.page is null");
        return this.page.$$(selector);
    }

    async scrollTo(text: string): Promise<void> {
        if (!this.page) return Promise.reject("this.page is null");
        const selector = `::-p-xpath(//[contains(text(), ${text})])`;

        try {
            const el = await this.page.$(selector);
            if (el === null) return Promise.reject("Element not found.");
            await el.scrollIntoView();
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

export class MockBrowser implements IBrowser {
    constructor(private fakeScreenshot: Buffer) {
    }

    $class(className: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    $texts(...linkText: string[]): Promise<void> {
        return Promise.resolve(undefined);
    }

    close(): Promise<void> {
        return Promise.resolve(undefined);
    }

    currentUrl(): URL {
        return new URL("https://example.com");
    }

    goTo(url: URL): Promise<HTTPResponse | null> {
        return Promise.resolve(null);
    }

    launch(url: URL): Promise<void> {
        return Promise.resolve(undefined);
    }

    screenshot(full?: boolean): Promise<Buffer> {
        return Promise.resolve(this.fakeScreenshot);
    }

    scrollTo(text: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    selectAll(selector: string): Promise<ElementHandle<Element>[]> {
        return Promise.resolve([]);
    }

    selectTextWithTag(tag: string, ...text: string[]): Promise<ElementHandle | null> {
        return Promise.resolve(null);
    }

}
