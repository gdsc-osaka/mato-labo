import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY as string);
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const callAIWithImage = async (prompt: string, imageBuffer: Buffer) => {
    const image = {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: "image/png",
        },
    };

    return await visionModel.generateContent([prompt, image]);
}

export const callAI = async (prompt: string) => {
    return await textModel.generateContent([prompt]);
}

export const extractJsonFromResult = (result: string) => {
    const match = result.match(/```json([^`]*)```/);

    if (!match) {
        throw new Error("Couldn't extract json string from GenerateContentResult.");
    }

    return JSON.parse(match[1]);
}
