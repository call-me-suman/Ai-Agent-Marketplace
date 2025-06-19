import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    // Log environment variable status (without exposing the key)
    console.log('OpenAI API Key status:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Try a simple completion to verify the API key works
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Hello, this is a test." }],
      model: "gpt-3.5-turbo",
      max_tokens: 10,
    });

    return NextResponse.json({
      status: 'success',
      message: 'OpenAI API key is working correctly',
      response: completion.choices[0].message.content
    });

  } catch (error: any) {
    console.error('Error testing OpenAI:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to OpenAI',
        details: error.message
      },
      { status: 500 }
    );
  }
} 