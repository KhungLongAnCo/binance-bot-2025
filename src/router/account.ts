import { Router } from "express";
import { getBalance } from "../api/account";

const accountRouter = Router();

accountRouter.get("/", async (req, res) => {
  const order = await getBalance();
  res.json(order);
});

export default accountRouter;
