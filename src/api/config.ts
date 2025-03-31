import crypto from "crypto";

import dotenv from "dotenv";
import { CONFIG } from "../config/config";

dotenv.config();

export const BINANCE_API_KEY = process.env.BINANCE_API_KEY!;
export const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY!;
export const BINANCE_BASE_URL = process.env.BINANCE_BASE_URL!;

const defaultParams = {
  symbol: CONFIG.MAIN_PAIR,
  side: "BUY",
  type: "MARKET",
  quantity: 0.01,
  timestamp: Date.now(),
};

export const createSignature = (params?: Record<string, any>): string => {
  const queryString = new URLSearchParams(
    Object.entries(params ? params : defaultParams).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  return crypto
    .createHmac("sha256", BINANCE_SECRET_KEY)
    .update(queryString)
    .digest("hex");
};
