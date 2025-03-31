import { getBalance } from "../api/account";
import {
  closePosition,
  currentPositions,
  getCurrentPositions,
  placeOrder,
} from "../api/order";
import { currentRsi, currentTrend, getRSI } from "../api/rsi";
import { CONFIG } from "../config/config";

/*

trade by tren if currentTrend = "UPTREND" => buy only
if currentTrend = "DOWNTREND" => sell only

open order with these case: 
when RSI <=30 
and not have any current order => open order long 
when RSI <=30 and have open order and 
open order with profit -10% => open order long 
when RSI >= 70 and not have any current order => open order short
 when RSI >= 70 and have open order and open order with profit -10% => open order short

Close order when check all current open order if current price 
when close order have profit 20% or -20%

*/

export const init = () => {
  getBalance();
  // getOpenOrders("BTCUSDT");
  getCurrentPositions();
};

export const exec = async (
  symbol: string = CONFIG.MAIN_PAIR,
  currentPrice: number
) => {
  try {
    const rsi = currentRsi;
    const positions = currentPositions || [];

    console.log(`RSI: ${rsi}, Current Price: ${currentPrice}`);

    // Lấy vị thế hiện tại của cặp giao dịch
    const position: any = positions?.find?.(
      (pos: any) => pos.symbol === symbol
    );
    const positionAmt = position ? parseFloat(position?.positionAmt) : 0;
    const entryPrice = position ? parseFloat(position?.entryPrice) : 0;

    if (positionAmt === 0) {
      // Không có vị thế nào đang mở
      if (rsi <= 30 && currentTrend === "UPTREND") {
        console.log("Opening LONG position...");
        await placeOrder(symbol, "BUY", 0.01);
        init();
      } else if (rsi >= 70 && currentTrend === "DOWNTREND") {
        console.log("Opening SHORT position...");
        await placeOrder(symbol, "SELL", 0.01);
        init();
      }
    } else {
      // Tính toán lợi nhuận hiện tại
      const profitPercentage =
        ((currentPrice - entryPrice) / entryPrice) *
        100 *
        Math.sign(positionAmt);
      console.log(
        `Position: ${symbol}, Entry Price: ${entryPrice}, Profit: ${profitPercentage.toFixed(
          2
        )}%`
      );

      // Nếu RSI <= 30 và đang lỗ > 10%, mở thêm Long
      if (
        rsi <= 30 &&
        positionAmt > 0 &&
        profitPercentage <= -10 &&
        currentTrend === "UPTREND"
      ) {
        console.log("Adding to LONG position...");
        await placeOrder(symbol, "BUY", 0.01);
        init();
      }

      // Nếu RSI >= 70 và đang lỗ > 10%, mở thêm Short
      if (
        rsi >= 70 &&
        positionAmt < 0 &&
        profitPercentage <= -10 &&
        currentTrend === "DOWNTREND"
      ) {
        console.log("Adding to SHORT position...");
        await placeOrder(symbol, "SELL", 0.01);
        init();
      }

      // Đóng vị thế nếu lợi nhuận đạt 20% hoặc lỗ 20%
      if (
        profitPercentage >= CONFIG.TAKE_PROFIT ||
        profitPercentage <= CONFIG.STOP_LOSS
      ) {
        console.log(
          `Closing position ${symbol} due to profit/loss condition...`
        );
        await closePosition(symbol, positionAmt);
        init();
      }
    }
  } catch (error) {
    console.error("Error executing trade strategy:", error);
  }
};

export const startStragy1 = () => {
  init();
  console.log("Start strategy 1");
};
