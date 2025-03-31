import express from "express";
import { getOpenOrders, placeOrder } from "./api/order";
import "./api/rsi";

import dotenv from "dotenv";
import orderRouter from "./router/order";
import accountRouter from "./router/account";

dotenv.config();

const app = express();
app.use(express.json());

app.set("view engine", "ejs"); // Nếu dùng EJS

app.get("/", async (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/account", accountRouter);
app.use("/order", orderRouter);

import "./binance-helper/stream";

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
