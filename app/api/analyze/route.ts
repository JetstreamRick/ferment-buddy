import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Initialize OpenAI client only at runtime, not during build
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Remove data URL prefix if present (data:image/jpeg;base64,)
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, "");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fun, witty fermentation expert who analyzes fermentation images with humor and personality. Always respond in complete sentences with a fun, conversational tone.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this fermentation image and provide:
1. A fun, conversational analysis in 3-4 sentences describing the colors, textures, mold presence, bubbles, brine level, and overall vibe. Be witty and entertaining!
2. A safety rating from 1-10 where:
   - 1-2: "You Will Die" (dangerous, definitely don't eat)
   - 3-4: "Probably Regret It" (risky, proceed with caution)
   - 5-6: "Questionable But Brave" (uncertain, use your judgment)
   - 7-8: "Probably Fine" (likely safe, looks good)
   - 9-10: "Fermentation Gold" (perfect, absolutely safe)

Format your response EXACTLY as:
ANALYSIS: [your fun analysis here]
RATING: [number 1-10]
RATING_LABEL: [the label like "You Will Die" or "Fermentation Gold"]`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const fullResponse = response.choices[0]?.message?.content || "No analysis available";
    
    // Parse the response
    const analysisMatch = fullResponse.match(/ANALYSIS:\s*(.+?)(?=RATING:|$)/s);
    const ratingMatch = fullResponse.match(/RATING:\s*(\d+)/);
    const ratingLabelMatch = fullResponse.match(/RATING_LABEL:\s*(.+?)(?:\n|$)/);
    
    const analysis = analysisMatch?.[1]?.trim() || fullResponse;
    const rating = ratingMatch?.[1] ? parseInt(ratingMatch[1]) : null;
    const ratingLabel = ratingLabelMatch?.[1]?.trim() || null;

    return NextResponse.json({ 
      analysis,
      rating,
      ratingLabel 
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

