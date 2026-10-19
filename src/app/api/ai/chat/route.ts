import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, AI_MODEL } from "@/lib/openai";

/**
 * POST /api/ai/chat
 *
 * Public AI chatbot endpoint for website visitors.
 * No auth required — this is customer-facing.
 * Rate limiting should be added in production.
 */

const SYSTEM_PROMPT = `You are a friendly and knowledgeable solar energy consultant chatbot for Hujurat Solar, Sydney's trusted solar installation company.

About Hujurat Solar:
- CEC Accredited solar installer in Sydney, NSW, Australia
- Services: Residential solar, Commercial solar, Battery storage, Solar maintenance
- Service areas: All of Greater Sydney and surrounding NSW regions
- Website: hujuratsolar.com.au

Your role:
- Answer questions about solar panels, battery storage, installation process, costs, and savings
- Explain Australian government incentives (STCs, feed-in tariffs, NSW battery rebates)
- Help visitors understand which solar system size suits their needs
- Encourage visitors to book a FREE consultation or get a FREE quote
- Be concise (2-4 sentences per response), friendly, and professional
- If asked about specific pricing, say that prices depend on system size and property, and encourage a free quote
- Always mention Hujurat Solar by name when relevant
- If a question is unrelated to solar/energy, politely redirect to solar topics

Contact info to share when relevant:
- Free Quote: Visit hujuratsolar.com.au/contact
- Phone: Available on the website
- Email: services@hujurat.com.au`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    // Build conversation history (limit to last 10 messages to save tokens)
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("[AI Chat] Error:", error);
    return NextResponse.json(
      { error: "Chat service temporarily unavailable" },
      { status: 500 }
    );
  }
}
