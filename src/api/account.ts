import axios from "axios";
import { BINANCE_API_KEY, BINANCE_BASE_URL, createSignature } from "./config";

export let currentBanlace = undefined;

export const getBalance = async () => {
  try {
    const params: Record<string, any> = {
      timestamp: Date.now(),
    };

    const signature = createSignature(params);
    params.signature = signature;

    const response = await axios.get(`${BINANCE_BASE_URL}/fapi/v2/balance`, {
      headers: { "X-MBX-APIKEY": BINANCE_API_KEY },
      params,
    });

    // console.log("Balance Response:", response.data);
    currentBanlace = response.data;
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching balance:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data || error.message);
  }
};
