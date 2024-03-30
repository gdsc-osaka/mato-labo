import puppeteer, {Page} from "puppeteer";

const logger = {
    log: (msg: string) => console.log(`[Crawler] ${msg}`),
    error: (msg: unknown) => console.error(`[Crawler] ${msg}`)
}

type LaboPageScreenshots = {
    members: Buffer,
    access: Buffer,
}

export const takeLaboPageScreenshot = async (laboUrl: URL): Promise<LaboPageScreenshots | undefined> => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 })
        await page.goto(laboUrl.toString(), {"waitUntil": "domcontentloaded"});
        logger.log("Fetching laboratory page complete.")

        const membersScreenshot = await navigateAndTakeScreenshot(page, "Members", "Member", "メンバー");
        logger.log(`Taking Member Page screenshot complete.`);

        const accessScreenshot = await navigateAndTakeScreenshot(page, "Access", "アクセス", "About");
        logger.log(`Taking Access Page screenshot complete.`);

        await page.close();

        return {members: membersScreenshot, access: accessScreenshot};

    } catch (e) {
        logger.error(e);
        return Promise.reject(e);
    } finally {
        await browser.close();
    }
}

const navigateAndTakeScreenshot = async (page: Page, ...linkText: string[]) => {
    const membersLink = await selectLink(page, ...linkText);
    if (membersLink === null) {
        return Promise.reject(`Couldn't find ${linkText.join(', ')} Page link.`);
    }

    await membersLink.click();
    await page.waitForNavigation();
    return await page.screenshot({ path: `./crawler/${linkText[0]}.png`, fullPage: true });
}

const selectLink = async (page: Page, ...linkText: string[]) => {
    try {
        return await page.$(`::-p-xpath(${linkText
            .map(text => `//a[text()="${text}"]`).join(' | ')})`);
    } catch (e) {
        logger.error(e);
        return Promise.reject(e);
    }
}
