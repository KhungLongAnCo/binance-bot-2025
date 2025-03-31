import axios from "axios";
import crypto from "crypto";
import { BINANCE_API_KEY, BINANCE_BASE_URL, createSignature } from "./config";

export let openOrders = undefined;
export let currentPositions = undefined;
/*
 symbol: 'BTCUSDT',
    positionAmt: '0.002',
    entryPrice: '81695.5',
    breakEvenPrice: '81728.1782',
    markPrice: '81590.00853333',
    unRealizedProfit: '-0.21098293',
    liquidationPrice: '0',
    leverage: '20',
    maxNotionalValue: '20000000',
    marginType: 'cross',
    isolatedMargin: '0.00000000',
    isAutoAddMargin: 'false',
    positionSide: 'BOTH',
    notional: '163.18001706',
    isolatedWallet: '0',
    updateTime: 1743412709126,
    isolated: false,
*/

export const placeOrder = async (
  symbol: string,
  side: "BUY" | "SELL",
  quantity: number,
  type: "MARKET" | "LIMIT" = "MARKET"
) => {
  try {
    const params: Record<string, any> = {
      symbol,
      side,
      type,
      quantity,
      timestamp: Date.now(),
    };

    console.log("params", params);
    const signature = createSignature(params);
    params.signature = signature;

    console.log("Order Params:", params);
    console.log("Signature:", signature);

    const response = await axios.post(
      `${BINANCE_BASE_URL}/fapi/v1/order`,
      null,
      {
        headers: { "X-MBX-APIKEY": BINANCE_API_KEY },
        params,
      }
    );
    openOrders = response.data;
    return response.data;
  } catch (error: any) {
    console.error("Order Error:", error.response?.data || error.message);
    return undefined;
  }
};

export const getOpenOrders = async (symbol?: string) => {
  try {
    const params: Record<string, any> = {
      timestamp: Date.now(),
    };

    // Include the symbol if provided
    if (symbol) {
      params.symbol = symbol;
    }

    // Generate the signature
    const signature = createSignature(params);
    params.signature = signature;

    // Make the API request
    const response = await axios.get(`${BINANCE_BASE_URL}/fapi/v1/openOrders`, {
      headers: { "X-MBX-APIKEY": BINANCE_API_KEY },
      params,
    });
    console.log("Open Orders Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching open orders:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data || error.message);
  }
};

/**
 * Đóng một order bằng orderId
 * @param symbol - Cặp giao dịch (BTCUSDT, ETHUSDT, ...)
 * @param orderId - ID của order cần đóng
 */
export const cancelOrder = async (symbol: string, orderId: string) => {
  try {
    const params: Record<string, any> = {
      symbol,
      orderId,
      timestamp: Date.now(),
    };

    // Tạo chữ ký
    const signature = createSignature(params);
    params.signature = signature;

    // Gọi API Binance để huỷ lệnh
    const response = await axios.delete(`${BINANCE_BASE_URL}/fapi/v1/order`, {
      headers: { "X-MBX-APIKEY": BINANCE_API_KEY },
      params,
    });

    console.log("Cancel Order Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error canceling order:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data || error.message);
  }
};

// Lấy thông tin các vị thế hiện tại

export const getCurrentPositions = async () => {
  try {
    const params: Record<string, any> = {
      timestamp: Date.now(),
    };

    // Tạo chữ ký
    const signature = createSignature(params);
    params.signature = signature;

    // Gửi request đến Binance API
    const response = await axios.get(
      `${BINANCE_BASE_URL}/fapi/v2/positionRisk`,
      {
        headers: { "X-MBX-APIKEY": BINANCE_API_KEY },
        params,
      }
    );

    // Lọc ra các vị thế đang mở (khối lượng không phải 0)
    const openPositions = response.data.filter(
      (pos: any) => parseFloat(pos.positionAmt) !== 0
    );

    console.log("Open Positions:", openPositions);
    currentPositions = openPositions;
    return openPositions;
  } catch (error: any) {
    console.error(
      "Error fetching positions:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data || error.message);
  }
};

// Function to close an open position
export const closePosition = async (symbol: string, positionAmt: number) => {
  try {
    // Determine the side to close the position
    const side = positionAmt > 0 ? "SELL" : "BUY"; // If long -> sell, If short -> buy

    const params: Record<string, any> = {
      symbol,
      side,
      type: "MARKET", // Close position using market order
      quantity: Math.abs(positionAmt), // Ensure quantity is positive
      reduceOnly: true, // Ensure it only reduces the existing position
      timestamp: Date.now(),
    };

    // Generate the signature
    const signature = createSignature(params);
    params.signature = signature;

    // Send the request to Binance
    const response = await axios.post(
      `${BINANCE_BASE_URL}/fapi/v1/order`,
      null,
      {
        headers: { "X-MBX-APIKEY": BINANCE_API_KEY },
        params,
      }
    );

    console.log(`Closed position for ${symbol}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error closing position:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data || error.message);
  }
};
