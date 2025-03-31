import { Router } from "express";
import { getOpenOrders, placeOrder } from "../api/order";

const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
  const { symbol, side, quantity } = req.body;
  const order = await placeOrder("BTCUSDT", "BUY", 0.01, "MARKET");
  res.json(order);
});

orderRouter.get("/open", async (req, res) => {
  const order = await getOpenOrders();
  res.json(order);
});

export default orderRouter;
