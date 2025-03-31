import axios from "axios";

export let currentRsi: number;
export let currentTrend = "UNKNOWN";

export const getRSI = async (
  symbol: string,
  interval: string,
  period: number = 14
) => {
  try {
    // Fetch historical candlestick data
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${
        period + 1
      }`
    );

    const candles = response.data;

    // Extract closing prices
    const closingPrices = candles.map((candle: any) => parseFloat(candle[4]));

    // Calculate price changes
    const changes = closingPrices
      .slice(1)
      .map((close: any, i: any) => close - closingPrices[i]);

    // Separate gains and losses
    const gains = changes.map((change: any) => (change > 0 ? change : 0));
    const losses = changes.map((change: any) =>
      change < 0 ? Math.abs(change) : 0
    );

    // Calculate average gain and loss
    const avgGain =
      gains.reduce((sum: any, gain: any) => sum + gain, 0) / period;
    const avgLoss =
      losses.reduce((sum: any, loss: any) => sum + loss, 0) / period;

    // Calculate RS and RSI
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    console.log("rsi", rsi);
    currentRsi = rsi;
    return rsi;
  } catch (error) {
    console.error("Error fetching RSI:", error);
    throw error;
  }
};

export const checkTrend = async (symbol: string): Promise<string> => {
  try {
    const rsi4h = await getRSI(symbol, "4h");

    if (rsi4h > 55) {
      return "UPTREND";
    } else if (rsi4h < 45) {
      return "DOWNTREND";
    } else {
      return "SIDEWAYS";
    }
  } catch (error) {
    console.error("Error checking trend:", error);
    return "UNKNOWN";
  }
};

// Cập nhật RSI mỗi 1 phút
setInterval(() => {
  getRSI("BTCUSDT", "15m");
}, 60 * 1000);

// Cập nhật RSI mỗi 100 phút

setInterval(async () => {
  currentTrend = await checkTrend("BTCUSDT");
}, 6000 * 1000);

getRSI("BTCUSDT", "15m");
checkTrend("BTCUSDT");
