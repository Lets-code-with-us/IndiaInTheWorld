import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is not configured.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { action, indicatorId, indicatorName, category, compareCountryCode, promptCustom } = body;

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let prompt = '';

    if (action === 'report-card') {
      prompt = `
You are a lead senior economic & public policy intelligence analyst evaluating India's global performance.
Generate a comprehensive, data-driven "India Annual Global Progress & Policy Report Card" evaluating India's performance across 10 major dimensions:
1. Economy & Trade
2. Society & Living Standards
3. Governance & Institutional Rights
4. Technology & Innovation
5. Education & Human Capital
6. Healthcare & Well-being
7. Environment & Climate Change
8. Safety & Security
9. Gender Equality & Parity
10. Digital Government & Infrastructure

Please provide your response in clear, beautifully formatted Markdown with the following structured sections:

# 📊 India Global Performance Annual Report Card

## Executive Overview & Strategic Trajectory
[Provide a 3-paragraph summary of India's macroeconomic trajectory, global rank position improvements, and key strategic priorities.]

## Overall Grade & Sector Summary
- **Overall Global Index Grade**: [e.g. B+ / A-]
- **Primary Strategic Strengths**: [List 3 key areas where India excels globally]
- **Critical Policy Bottlenecks**: [List 3 areas needing immediate reform]

## Comprehensive SWOT Analysis
### 🚀 Strengths
- [Detail 3 data-backed strengths]

### ⚡ Weaknesses & Gaps
- [Detail 3 data-backed gaps]

### 💡 Opportunities (2026-2030)
- [Detail 3 high-impact global opportunities]

### ⚠️ Threats & Vulnerabilities
- [Detail 3 structural or geopolitical threats]

## 🔮 2028-2030 Horizon Predictions
- **GDP & Economic Scale**: [Prediction based on current growth trajectory]
- **Innovation & AI Leadership**: [Prediction on GII and AI Readiness]
- **Quality of Life & Human Capital**: [Prediction on HDI and Healthcare]

## 🏛 Top 5 Key Policy Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]
4. [Recommendation 4]
5. [Recommendation 5]
`;
    } else if (action === 'explain-indicator') {
      prompt = `
You are an expert global policy researcher.
Provide an in-depth breakdown of India's ranking for the indicator: "${indicatorName}" in the "${category}" category.

Please format your response in Markdown with:
1. **Executive Context**: What this metric measures and why it matters globally.
2. **India's Current Standing & Historical Trajectory**: Analysis of recent movements (improvements or declines).
3. **Key Growth Drivers & Reform Policies**: Government schemes or market dynamics shaping this rank.
4. **Comparative Analysis**: How India compares against peers like China, Vietnam, US, and Germany.
5. **Actionable Roadmap**: 3 high-priority policy recommendations to improve India's rank by 10-20 places.
`;
    } else if (action === 'compare-country') {
      prompt = `
You are a macroeconomic analyst.
Provide a comparative strategic analysis comparing **India (IND)** and **Country Code: ${compareCountryCode}**.

Structure your output in clear Markdown:
1. **Executive Comparison Overview**: Macro economic contrast, population, and strategic positioning.
2. **Key Advantage Areas for India**: Where India outperforms or holds greater velocity.
3. **Key Advantage Areas for Comparison Country**: Where the comparison country excels.
4. **Supply Chain & Strategic Opportunities**: Potential synergies, trade links, and lesson sharing.
5. **Policy Takeaways for India**: What India can emulate to close gaps.
`;
    } else {
      prompt = promptCustom || 'Provide a concise analytical summary on India’s global economic and technological rankings.';
    }

    // Call Gemini 3.1 Pro Preview with HIGH Thinking Level per prompt instructions
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
      text: response.text || 'Analysis generation completed.',
      model: 'gemini-3.1-pro-preview',
    });
  } catch (err: any) {
    console.error('Gemini Insights Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate AI insights.' },
      { status: 500 }
    );
  }
}
