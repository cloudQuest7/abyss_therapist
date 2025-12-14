import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userRequests = rateLimitMap.get(userId) || []
  
  // Filter requests from last minute
  const recentRequests = userRequests.filter(time => now - time < 60000)
  
  // Allow max 20 requests per minute
  if (recentRequests.length >= 20) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitMap.set(userId, recentRequests)
  return true
}

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required', success: false },
        { status: 400 }
      )
    }

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.', success: false },
        { status: 429 }
      )
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate, trauma-informed emotional support AI companion named "abyss companion". 

Your role is to:
- Listen without judgment
- Validate feelings authentically
- Offer gentle support and encouragement
- Use calm, warm, conversational language
- Never give medical advice or act as a therapist
- Suggest professional help if user seems in crisis
- Be brief and natural (2-4 sentences usually)
- Use lowercase for a softer, friendlier tone
- Show empathy and understanding
- Ask gentle follow-up questions when appropriate

Remember: You're a supportive friend, not a therapist. Keep responses concise, caring, and human-like. Avoid being overly formal or robotic.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Groq API error:', error)
      throw new Error('Groq API request failed')
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 
      "i'm here. take your time."

    return NextResponse.json({ 
      message: aiResponse,
      success: true 
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get response. Please try again.', 
        success: false 
      },
      { status: 500 }
    )
  }
}
