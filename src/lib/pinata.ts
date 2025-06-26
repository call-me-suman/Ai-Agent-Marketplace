import axios from "axios";

const PINATA_API_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs";
const PINATA_QUERY_URL = "https://api.pinata.cloud/data/pinList";

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface PinataMetadata {
  name: string;
  keyvalues: {
    agentId: string;
    userAddress: string;
    timestamp: string;
  };
}

interface ChatInteraction {
  agentId: string;
  userMessage: string;
  assistantResponse: string;
  timestamp: string;
  walletAddress: string;
  transactionType?: "trial" | "paid";
  ipfsHash?: string;
  transactionHash?: string;
}

export async function storeToIPFS(
  data: ChatInteraction
): Promise<{ hash: string; url: string }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

    if (!apiKey || !secretKey) {
      throw new Error("Pinata API keys not configured");
    }

    console.log("Storing data to IPFS:", {
      agentId: data.agentId,
      walletAddress: data.walletAddress,
      transactionType: data.transactionType,
      messageLength: data.userMessage.length,
      responseLength: data.assistantResponse.length,
    });

    const response = await axios.post<PinataResponse>(
      PINATA_API_URL,
      {
        pinataContent: data,
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: `Agent-Interaction-${Date.now()}`,
          keyvalues: {
            agentId: data.agentId,
            walletAddress: data.walletAddress,
            transactionType:
              data.transactionType || (data.transactionHash ? "paid" : "trial"),
            timestamp: data.timestamp,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      }
    );

    const hash = response.data.IpfsHash;
    const url = `${PINATA_GATEWAY_URL}/${hash}`;

    console.log("Successfully stored in IPFS:", { hash, url });
    return { hash, url };
  } catch (error) {
    console.error("Error storing to IPFS:", error);
    throw new Error("Failed to store data on IPFS");
  }
}

export async function getHistoryFromIPFS(
  walletAddress: string
): Promise<ChatInteraction[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

    if (!apiKey || !secretKey) {
      throw new Error("Pinata API keys not configured");
    }

    console.log("Fetching history for wallet:", walletAddress);

    // Query Pinata for files with matching metadata
    const queryResponse = await axios.get(PINATA_QUERY_URL, {
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      params: {
        status: "pinned",
        metadata: {
          name: "Agent-Interaction",
          keyvalues: {
            walletAddress: {
              value: walletAddress,
              op: "eq",
            },
          },
        },
      },
    });

    console.log("Found pins:", queryResponse.data.rows.length);

    // Fetch content for each pin
    const historyPromises = queryResponse.data.rows.map(async (pin: any) => {
      try {
        const contentResponse = await axios.get(
          `${PINATA_GATEWAY_URL}/${pin.ipfs_pin_hash}`
        );
        const interaction: ChatInteraction = {
          ...contentResponse.data,
          ipfsHash: pin.ipfs_pin_hash,
        };
        return interaction;
      } catch (error) {
        console.error(
          `Failed to fetch content for hash ${pin.ipfs_pin_hash}:`,
          error
        );
        return null;
      }
    });

    const history = (await Promise.all(historyPromises)).filter(Boolean);

    // Sort by timestamp, newest first
    return history.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error fetching history from IPFS:", error);
    throw new Error("Failed to fetch history from IPFS");
  }
}
