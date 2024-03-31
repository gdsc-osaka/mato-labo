import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

export const callAIWithImage = async (prompt: string, imageBuffer: Buffer) => {
    const image = {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: "image/png",
        },
    };

    return await model.generateContent([prompt, image]);
}

export const extractJsonFromResult = (result: string) => {
    const match = result.match(/```json([^`]*)```/);

    if (!match) {
        throw new Error("Couldn't extract json string from GenerateContentResult.");
    }

    return JSON.parse(match[1]);
}
