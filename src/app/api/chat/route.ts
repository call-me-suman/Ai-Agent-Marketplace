import { NextResponse } from 'next/server';
import { makeOllamaStreamingRequest } from '@/lib/ai-utils';
import { storeToIPFS } from '@/lib/pinata';

export async function POST(request: Request) {
  try {
    const { message, agentId, walletAddress, transactionHash } = await request.json();
    console.log('Received chat request:', { message, agentId, walletAddress, transactionHash });

    // Create a TransformStream for streaming the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    let fullResponse = '';

    // Start streaming response
    makeOllamaStreamingRequest(
      message,
      async (chunk: string) => {
        fullResponse += chunk;
        await writer.write(encoder.encode(chunk));
      },
      async () => {
        // Store the interaction in IPFS after completion
        try {
          console.log('Preparing to store in IPFS:', {
            agentId,
            messageLength: message.length,
            responseLength: fullResponse.length,
          });

          const interactionData = {
            agentId,
            userMessage: message,
            assistantResponse: fullResponse,
            timestamp: new Date().toISOString(),
            walletAddress: walletAddress || 'anonymous',
            transactionType: transactionHash ? 'paid' : 'trial',
            transactionHash
          };

          const { hash, url } = await storeToIPFS(interactionData);
          console.log('Successfully stored in IPFS:', { hash, url });

          // Write the IPFS hash to the stream before closing
          await writer.write(
            encoder.encode(
              `\n\n---\nStored in IPFS: ${hash}\nView at: ${url}`
            )
          );
        } catch (error) {
          console.error('Failed to store in IPFS:', error);
          // Write error message to stream
          await writer.write(
            encoder.encode(
              '\n\n---\nFailed to store chat history in IPFS. Please try again later.'
            )
          );
        } finally {
          await writer.close();
        }
      },
      agentId
    );

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 