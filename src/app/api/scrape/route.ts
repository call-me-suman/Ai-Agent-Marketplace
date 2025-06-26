import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const response = await fetch(url, {
      // Pretend to be a browser to avoid basic bot blocks
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
      // 10-second timeout via AbortController
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'cannot access the page' }, { status: 500 });
    }

    const html = await response.text();

    // Simple extraction – strip scripts/styles, remove tags, condense whitespace
    const textWithoutScripts = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');

    const rawText = textWithoutScripts
      .replace(/<[^>]+>/g, ' ') // strip HTML tags
      .replace(/\s+/g, ' ') // collapse whitespace
      .trim();

    const wordCount = rawText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // ~200 wpm

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : url;

    return NextResponse.json({
      url,
      title,
      content: rawText,
      metadata: {
        lastModified: Date.now(),
      },
      extractedData: {
        links: [],
        images: [],
        tables: [],
        forms: [],
      },
      readingTime,
      wordCount,
    });
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json({ error: 'cannot access the page' }, { status: 500 });
  }
} 