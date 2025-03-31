import { Router } from "express";
import { getOpenOrders, placeOrder } from "../api/order";
import { CONFIG } from "../config/config";

const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
  const { symbol, side, quantity } = req.body;
  const order = await placeOrder(CONFIG.MAIN_PAIR, "BUY", 0.01, "MARKET");
  res.json(order);
});

orderRouter.get("/open", async (req, res) => {
  const order = await getOpenOrders();
  res.json(order);
});

export default orderRouter;
