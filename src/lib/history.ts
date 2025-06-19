export interface HistoryEntry {
  walletAddress: string;
  agentId: string;
  timestamp: number;
  action: string;
  result: string;
}

export const storeHistory = async (entry: HistoryEntry) => {
  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error('Failed to store history');
    }

    const data = await response.json();
    return data.ipfsHash;
  } catch (error) {
    console.error('Error storing history:', error);
    throw error;
  }
};

export const fetchHistory = async (walletAddress: string) => {
  try {
    const response = await fetch(`/api/history?walletAddress=${walletAddress}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    const data = await response.json();
    return data.history;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}; 