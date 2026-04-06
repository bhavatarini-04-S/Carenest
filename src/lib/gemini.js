import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export function buildSystemPrompt(ageCategory, professions, mood, targetLanguage = 'English (India)') {
    const moodText = mood ? `Their current mood score is ${mood}/5.` : ''
    const profText = professions?.length ? professions.join(', ') : 'unknown'

    const toneMap = {
        '18-25': 'Casual, validating, peer-like. Use gentle warmth. Address academic stress, identity, social anxiety.',
        '25-35': 'Empathetic and practical. Focus on burnout, work-life balance, relationships.',
        '35-45': 'Warm and grounded. Address family stress, mid-life transitions, purpose.',
        '45+': 'Respectful, calm, unhurried. Address loneliness, grief, health anxiety.',
    }

    return `You are CareNest, a compassionate AI mental health support companion.
The user is in the ${ageCategory || '18-25'} age group, working as ${profText}. ${moodText}

Language Rule: The user is speaking/texting in ${targetLanguage}. You MUST reply conversationally in ONLY ${targetLanguage}. Ensure your script natively matches the language.

Tone: ${toneMap[ageCategory] || toneMap['18-25']}

Rules:
1. Never diagnose or prescribe medication.
2. If the user expresses suicidal ideation or crisis: respond with warmth and ALWAYS provide iCall (9152987821) and Vandrevala Foundation (1860-2662-345).
3. Keep responses strictly under 100 words (perfectly suited to be read aloud).
4. Always end with a gentle open question.
5. You are not a replacement for professional care.`
}

export async function sendGeminiMessage(messages, ageCategory, professions, mood, targetLanguage) {
    if (!API_KEY) throw new Error("Gemini API key is missing from environment variables.");

    // Using gemini-2.5-flash for rapid chat responsiveness
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Filter out the initial system-like instructions and map to Google AI format
    const contents = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));

    const result = await model.generateContent({
        contents: contents,
        systemInstruction: buildSystemPrompt(ageCategory, professions, mood, targetLanguage)
    });

    return result.response.text();
}
