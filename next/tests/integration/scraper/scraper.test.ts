import {describe, expect, test, vi} from "vitest";
import {LaboratoryScraper} from "@/crawler/scraper";
import {MockBrowser} from "@/crawler/browser";
import * as fs from "fs";
import path from "path";

describe("LaboratoryScraper Test", () => {
    // test("summarizeAbstract() should return correct object.", async () => {
    //     const abstract = "Modeling of real-world biological multi-agents is a fundamental problem in various scientific and engineering fields. Reinforcement learning (RL) is a powerful framework to generate flexible and diverse behaviors in cyberspace; however, when modeling real-world biological multi-agents, there is a domain gap between behaviors in the source (i.e., real-world data) and the target (i.e., cyberspace for RL), and the source environment parameters are usually unknown. In this paper, we propose a method for adaptive action supervision in RL from real-world demonstrations in multi-agent scenarios. We adopt an approach that combines RL and supervised learning by selecting actions of demonstrations in RL based on the minimum distance of dynamic time warping for utilizing the information of the unknown source dynamics. This approach can be easily applied to many existing neural network architectures and provide us with an RL model balanced between reproducibility as imitation and generalization ";
    //     const result = await summarizeAbstracts([abstract]);
    //     expect(result).toHaveProperty("summary_en");
    // });

    test("scrapeAbstract()", async () => {
        const abstScreenshot = fs.readFileSync(path.resolve(__dirname, "./abstract.png"))
        const scraper = new LaboratoryScraper(new MockBrowser(abstScreenshot));
        const fakeUrl = new URL("https://example.com")
        const result = await scraper.scrapeAbstract(fakeUrl);
        console.log(result)
        expect(result).not.toBe(undefined);
    })
})
