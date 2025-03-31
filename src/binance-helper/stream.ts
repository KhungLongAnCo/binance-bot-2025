import WebSocket from "ws";
// strategy here
import { exec, startStragy1 } from "../auto-trade/strategy1";

console.log("Streamflow module loaded.");

type BinanceStreamData = {
  e: string;
  E: number;
  s: string;
  p: string;
  q: string;
  T: number;
};

const ws = new WebSocket("wss://fstream.binance.com/ws/btcusdt@trade");

ws.on("open", () => {
  console.log("Connected to Binance Futures WebSocket");
});

ws.on("message", (data: string) => {
  const parsedData: BinanceStreamData = JSON.parse(data);
  exec("BTCUSDT", parseFloat(parsedData.p));
  // console.log(`BTCUSDT Price: ${parsedData.p} | Volume: ${parsedData.q}`);
});

ws.on("error", (error) => {
  console.error("WebSocket Error:", error);
});

ws.on("close", () => {
  console.log("WebSocket Disconnected");
});

startStragy1();
