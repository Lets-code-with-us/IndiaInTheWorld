import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is missing.' },
        { status: 500 }
      );
    }

    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
You are "India Index AI", an expert assistant specialized in global rankings, international indicators, and policy analytics for India.
You have instant knowledge of India's rankings across UN, World Bank, IMF, WHO, WEF, WIPO, RSF, Transparency International, Oxford Insights, and NITI Aayog datasets.

Key Facts to reference when relevant:
- GDP Rank: #5 Nominal ($3.93T), #3 PPP ($14.2T).
- Global Innovation Index: #39 (improved from #81 in 2015).
- Climate Change Performance Index: #10 globally.
- Global Cybersecurity Index: #10 globally.
- Government AI Readiness Index: #14 globally.
- Startup Ecosystem: #4 globally with 112+ Unicorns.
- GovTech Maturity Index: #15 (Group A).
- Press Freedom Index: #159.
- Corruption Perceptions Index: #93.
- Human Development Index (HDI): #134.
- World Happiness Report: #126.
- Global Gender Gap Index: #129.

Instructions:
- Provide clear, direct, objective, and data-backed answers.
- Always explain the "Why" behind rankings, citing key policies (like UPI, Digital Public Infrastructure, PLI Schemes, NEP 2020, Ayushman Bharat, PM Gati Shakti, etc.).
- Highlight both India's strengths and areas for improvement with policy recommendations.
- Keep output nicely formatted with Markdown bullet points and bold text. Do NOT use emojis in code or text output — use clean bullet points or numbers.
`;

    const prompt = `System Instructions: ${systemInstruction}\n\nUser Question: ${message}`;

    // Call Gemini 3.1 Pro Preview with HIGH Thinking Level
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    return NextResponse.json({
      text: response.text || 'I have analyzed the dataset and ranking indicators for India.',
      model: 'gemini-3.1-pro-preview',
    });
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process AI chat query.' },
      { status: 500 }
    );
  }
}
