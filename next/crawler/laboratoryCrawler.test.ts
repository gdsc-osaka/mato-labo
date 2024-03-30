import {test} from "vitest";
import {takeLaboPageScreenshot} from "@/crawler/laboratoryCrawler";

test("findLinkInLaboratory Test", async () => {
    return takeLaboPageScreenshot(new URL("https://www-mura.ist.osaka-u.ac.jp/"));
})
