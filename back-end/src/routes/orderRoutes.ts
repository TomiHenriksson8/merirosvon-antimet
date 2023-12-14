import { Router } from "express";
import {
  getAllOrders,
  getOrderCount,
  getOrderById,
  changeOrderStatusController,
  createOrderController,
  changeOrderEstimatedPickupTime
} from "../controllers/orderController";
import { authenticate, authorize } from '../middleware/authMiddleware';


const orderRouter = Router();

orderRouter.get("/latest/id", authenticate, authorize(['admin', 'staff']), getOrderCount);
orderRouter.get("/all", authenticate, authorize(['admin', 'staff']), getAllOrders);
orderRouter.put("/status/:orderid", authenticate, authorize(['admin', 'staff']), changeOrderStatusController);
orderRouter.put("/estimatedpt/:orderid", authenticate, authorize(['admin', 'staff']), changeOrderEstimatedPickupTime);
orderRouter.post("/create", createOrderController);
orderRouter.get("/:orderid", authenticate, getOrderById);


export default orderRouter;
