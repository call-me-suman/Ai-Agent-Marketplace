import { NextResponse } from 'next/server';
import { X402_API_KEY, X402_API_URL, type X402Invoice } from '@/lib/x402-config';

// Store subscriptions in memory (replace with your database in production)
const subscriptions = new Map<string, Set<string>>();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if user is already subscribed
    if (subscriptions.has(params.id) && subscriptions.get(params.id)?.has(address)) {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 400 }
      );
    }

    // Create x402Pay invoice
    const response = await fetch(`${X402_API_URL}/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${X402_API_KEY}`,
      },
      body: JSON.stringify({
        amount: 0.01,
        token: 'ETH',
        chain: 'sepolia',
        recipient: address,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }

    const invoice: X402Invoice = await response.json();

    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');
    const address = searchParams.get('address');

    if (!invoiceId || !address) {
      return NextResponse.json(
        { error: 'Invoice ID and address are required' },
        { status: 400 }
      );
    }

    // Check invoice status
    const response = await fetch(`${X402_API_URL}/invoice/${invoiceId}`, {
      headers: {
        'Authorization': `Bearer ${X402_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check invoice status');
    }

    const invoice: X402Invoice = await response.json();

    if (invoice.status === 'paid') {
      // Update subscription status
      if (!subscriptions.has(params.id)) {
        subscriptions.set(params.id, new Set());
      }
      subscriptions.get(params.id)?.add(address);

      return NextResponse.json({
        status: 'subscribed',
        message: 'Successfully subscribed to agent',
      });
    }

    return NextResponse.json({
      status: invoice.status,
      message: invoice.status === 'expired' ? 'Payment expired' : 'Payment pending',
    });
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

// Webhook handler for x402Pay payment updates
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { invoiceId, status, address } = await request.json();

    if (!invoiceId || !status || !address) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    if (status === 'paid') {
      // Update subscription status
      if (!subscriptions.has(params.id)) {
        subscriptions.set(params.id, new Set());
      }
      subscriptions.get(params.id)?.add(address);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 