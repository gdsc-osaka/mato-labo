import {describe, expect, test} from "vitest";
import {summarizeAbstract} from "@/crawler/scraper";

describe("scraper.ts test", () => {
    test("summarizeAbstract() should return correct object.", async () => {
        const abstract = "Modeling of real-world biological multi-agents is a fundamental problem in various scientific and engineering fields. Reinforcement learning (RL) is a powerful framework to generate flexible and diverse behaviors in cyberspace; however, when modeling real-world biological multi-agents, there is a domain gap between behaviors in the source (i.e., real-world data) and the target (i.e., cyberspace for RL), and the source environment parameters are usually unknown. In this paper, we propose a method for adaptive action supervision in RL from real-world demonstrations in multi-agent scenarios. We adopt an approach that combines RL and supervised learning by selecting actions of demonstrations in RL based on the minimum distance of dynamic time warping for utilizing the information of the unknown source dynamics. This approach can be easily applied to many existing neural network architectures and provide us with an RL model balanced between reproducibility as imitation and generalization ";
        const result = await summarizeAbstract([abstract]);
        expect(result).toHaveProperty("summary_en");
    })
})
