import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getOpenAI, AI_MODEL } from "@/lib/openai";

/**
 * POST /api/ai/generate
 *
 * Unified AI content generation endpoint for the marketing dashboard.
 * Requires admin authentication.
 *
 * Body: { type: string, prompt: string, context?: Record<string, string> }
 */

const SYSTEM_PROMPTS: Record<string, string> = {
  blog: `You are an expert Australian solar energy content writer for Hujurat Solar, a solar supply & installation company based in Sydney, NSW. 
Write engaging, SEO-optimized blog articles about solar energy topics relevant to Australian homeowners and businesses.
Include practical advice, reference Australian government rebates (STCs, feed-in tariffs), mention relevant suburbs/regions, and use a professional yet approachable tone.
Format with markdown: use ## for headings, **bold** for emphasis, bullet points for lists.
Always write comprehensive, informative articles of at least 800 words.`,

  seo_meta: `You are an SEO specialist for Hujurat Solar, an Australian solar installation company in Sydney.
Generate optimized meta titles (50-60 chars) and meta descriptions (140-160 chars) that:
- Include relevant solar keywords for Australian market
- Mention Sydney/NSW when appropriate
- Are compelling enough to drive high click-through rates from Google Australia
- Follow Google's latest SEO guidelines
Return the result as JSON: { "title": "...", "description": "..." }`,

  email: `You are a professional email marketing specialist for Hujurat Solar, a trusted solar supply & installation company in Sydney, Australia.
Write compelling marketing emails that:
- Have an attention-grabbing subject line
- Use a warm, professional tone
- Include clear calls-to-action (free quote, consultation booking)
- Reference current Australian solar incentives and benefits
- Are optimized for mobile reading
- Include proper greeting and sign-off from "Hujurat Solar Team"
Return the result as JSON: { "subject": "...", "body": "..." }`,

  service_description: `You are a professional copywriter for Hujurat Solar, an Australian solar installation company.
Write compelling, informative service descriptions that:
- Highlight key benefits for Australian homeowners/businesses
- Mention relevant Australian standards and certifications (CEC accredited)
- Include specifics about equipment brands (Fronius, Enphase, SunGrow, LONGi, etc.)
- Reference Australian government incentives where relevant
- Use a professional yet approachable tone
- Are structured with clear sections using markdown formatting`,

  social_media: `You are a social media marketing specialist for Hujurat Solar, a Sydney-based solar installation company.
Create engaging social media posts that:
- Are optimized for the specified platform (Facebook, Instagram, or LinkedIn)
- Include relevant hashtags
- Have a strong call-to-action
- Reference Australian solar benefits and local context
- Are the right length for the platform
Return the result as JSON: { "caption": "...", "hashtags": "..." }`,

  chatbot_greeting: `You are a friendly and knowledgeable solar energy consultant for Hujurat Solar, Sydney's trusted solar installation company.
Help website visitors with questions about:
- Solar panel systems and sizing
- Battery storage options
- Australian government rebates and incentives (STCs, feed-in tariffs)
- Installation process and timeline
- Cost savings and ROI
- Equipment brands and comparisons
Be concise, helpful, and always encourage booking a free consultation.`,
};

export async function POST(req: NextRequest) {
  // Require admin auth
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, prompt, context } = body as {
      type: string;
      prompt: string;
      context?: Record<string, string>;
    };

    if (!type || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: type, prompt" },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[type];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: `Unknown generation type: ${type}. Valid types: ${Object.keys(SYSTEM_PROMPTS).join(", ")}` },
        { status: 400 }
      );
    }

    // Build contextual info if provided
    let contextInfo = "";
    if (context) {
      contextInfo = "\n\nAdditional context:\n" +
        Object.entries(context)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join("\n");
    }

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt + contextInfo },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      result,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    console.error("[AI Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
