import { Router } from "express";
import {
  getAllOrders,
  getLatestOrderId,
  changeOrderStatusController,
  createOrderController,
} from "../controllers/orderController";

const orderRouter = Router();

orderRouter.get("/latest/id", getLatestOrderId);
orderRouter.get("/all", getAllOrders);
orderRouter.put("/status/:orderid", changeOrderStatusController);
orderRouter.post("/create", createOrderController);

export default orderRouter;
