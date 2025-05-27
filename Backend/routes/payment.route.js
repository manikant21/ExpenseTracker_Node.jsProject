import { Router } from "express";
import { createCashfreeOrder, handlePaymentStatus } from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.js";



const router = Router();
router.post("/create-order", authenticate, createCashfreeOrder);
router.get("/status/:orderId", handlePaymentStatus);

export {router};