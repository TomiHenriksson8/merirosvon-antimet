import { Router } from "express";
import {
  getAllOrders,
  getOrderCount,
  getOrderById,
  changeOrderStatusController,
  createOrderController
} from "../controllers/orderController";

const orderRouter = Router();

orderRouter.get("/latest/id", getOrderCount);
orderRouter.get("/all", getAllOrders);
orderRouter.put("/status/:orderid", changeOrderStatusController);
orderRouter.post("/create", createOrderController);
orderRouter.get("/:orderid", getOrderById);

export default orderRouter;
