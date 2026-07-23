import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { INDIAN_STATES_DATA } from '@/lib/data/states';
import { GLOBAL_INDICATORS } from '@/lib/data/indicators';

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

    // Format Indian states dataset into a clean JSON string for system context
    const statesDataSummary = INDIAN_STATES_DATA.map((s) => (
      `- State/UT: ${s.stateName} (${s.code}) | Category: ${s.category} | SDG Index Score: ${s.sdgScore}/100 | Innovation Score: ${s.innovationScore} | Health Index Score: ${s.healthIndexScore} | Export Preparedness Rank: #${s.exportPreparednessRank} | Literacy Rate: ${s.literacyRate}%`
    )).join('\n');

    // Format key global indicators for system context
    const globalIndicatorsSummary = GLOBAL_INDICATORS.map((ind) => (
      `- ${ind.name} (${ind.category}): Latest Rank #${ind.latestIndiaRank}/${ind.totalCountriesMeasured}, Value: ${ind.latestIndiaValue}, Trend: ${ind.trend} (${ind.changeDelta}). Publisher: ${ind.source.organization}.`
    )).join('\n');

    const systemInstruction = `You are "India Index AI", an expert assistant specialized in global rankings, international indicators, state development metrics across Indian states/UTs, and public policy analytics for India.

REAL DATASETS AVAILABLE TO YOU IN SYSTEM MEMORY:

--- INDIAN STATES & UTs DEVELOPMENT DATASET (NITI Aayog / MoSPI Metrics) ---
${statesDataSummary}

--- INDIA GLOBAL INDICATORS DATASET ---
${globalIndicatorsSummary}

INSTRUCTIONS FOR PROCESSING USER QUERIES:
1. When asked about a specific Indian state or UT (e.g. Bihar, Delhi, Kerala, Tamil Nadu, Karnataka, Maharashtra, Gujarat, UP, West Bengal, Rajasthan, Assam, etc.):
   - You MUST extract and state the EXACT numbers from the dataset above for that state (e.g. for Bihar: SDG Score 52, Innovation Score 12.1, Health Index Score 31.0, Export Preparedness Rank #21, Literacy Rate 61.8%, NITI Aayog Category: Aspirant).
   - Compare these figures directly against top-performing states (e.g. Kerala's SDG Score 75 & 96.2% Literacy, Karnataka's Innovation Score 62.5, Tamil Nadu's #1 Export Preparedness Rank).
   - Provide a structured breakdown:
     * **Executive Overview & Current Standing** (State profile with exact metrics)
     * **Comparative Performance Analysis** (Highlighting gaps vs national leaders)
     * **Key Bottlenecks & Reform Levers** (Identifying specific growth hurdles)
     * **Strategic Recommendations** (3-5 actionable policy steps to accelerate development)

2. When asked about Global Rankings / Indicators:
   - Reference the exact values, ranks, historical trends, and source publishers from the dataset.

3. General Formatting Rules:
   - Format cleanly using Markdown headers and bold bullet points.
   - Do NOT use emojis anywhere in the response text — use clean text, numbers, and bullet points.
   - Do NOT output generic canned responses like "I have analyzed your query". Always answer directly with deep, data-backed analysis tailored to the prompt.
`;

    // Process history if provided
    let conversationHistory = '';
    if (Array.isArray(history) && history.length > 0) {
      // Take last 6 messages for conversation context
      const recentHistory = history.slice(-6);
      conversationHistory = recentHistory
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
        .join('\n');
    }

    const fullPrompt = conversationHistory
      ? `Previous Conversation Context:\n${conversationHistory}\n\nCurrent User Query: ${message}`
      : `User Query: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const replyText = response.text || 'Unable to generate response from the AI model.';

    return NextResponse.json({
      text: replyText,
      model: 'gemini-2.5-flash',
    });
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process AI chat query.' },
      { status: 500 }
    );
  }
}

