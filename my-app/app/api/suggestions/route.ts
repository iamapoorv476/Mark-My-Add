import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { prompt, productId } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a sneaker design assistant. Based on this request: "${prompt}" for a ${productId} sneaker, suggest specific customizations.

Return a JSON object with this structure:
{
  "sole": { "color": "#hexcolor", "material": "leather|canvas|mesh|suede|patent" },
  "upper": { "color": "#hexcolor", "material": "leather|canvas|mesh|suede|patent" },
  "laces": { "color": "#hexcolor", "material": "leather|canvas|mesh|suede|patent" },
  "swoosh": { "color": "#hexcolor", "material": "leather|canvas|mesh|suede|patent" },
  "text": "optional custom text (max 20 chars)",
  "explanation": "Brief explanation of the design choices"
}

Only include parts that are customizable for the ${productId}. Use hex colors like #FF0000 for red, #0000FF for blue, etc.`,
    })

    // Parse the AI response
    const suggestion = JSON.parse(text)

    return Response.json(suggestion)
  } catch (error) {
    console.error("[v0] AI suggestion error:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate suggestions",
      },
      { status: 500 },
    )
  }
}
