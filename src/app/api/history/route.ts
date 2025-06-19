import { NextResponse } from 'next/server';
import { uploadToIPFS, getHistoryFromIPFS } from '@/lib/pinata';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const ipfsHash = await uploadToIPFS(data);
    return NextResponse.json({ success: true, ipfsHash });
  } catch (error) {
    console.error('Error storing history:', error);
    return NextResponse.json({ success: false, error: 'Failed to store history' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    const history = await getHistoryFromIPFS(walletAddress);
    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
  }
} 