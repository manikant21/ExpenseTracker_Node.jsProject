import { createOrder, getOrderStatus } from "../services/cashfreeServices.js";
import jwt from "jsonwebtoken";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import dotenv from 'dotenv'
import logger from "../utils/logger.js";

dotenv.config();

export const createCashfreeOrder = async (req, res) => {
  try {
    const userId = String(req.user.id); 
    const orderId = `order_${Date.now()}`;
    const orderAmount = 99; 

    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      "INR",       
      userId,
      "9876543210"   
    );
     await Order.create({
      orderId,
      paymentStatus: "PENDING",
      userId
    });

    res.status(200).json({ paymentSessionId });

  } catch (error) {
    // console.error("Error in creating Cashfree order:", error);
    logger.error(`Error in /payment route: ${error.message}`);
    res.status(500).json({ message: "Failed to create order" });
  }
};



export const handlePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = await getOrderStatus(orderId);
    let token ="";

    const order = await Order.findOne({ where: { orderId } });
    if (order) {
      order.paymentStatus = status;
      await order.save();
      if (status === "PAID") {
        const user = await User.findByPk(order.userId);
        if (user) {
          user.isPremium = true;
          await user.save();
          token = jwt.sign(
        { userId: user.id, name: user.name },
        process.env.JWT_SECRET
      );
        }
      }
    }

     let alertMessage = "";

    if (status === "PAID") {
      alertMessage = "Transaction Successful! Welcome to Premium.";
      
    } else if (status === "FAILED") {
      alertMessage = "TRANSACTION FAILED.";
    } else {
      alertMessage = `Transaction Status: ${status}`;
    }

    res.send(`
      <html>
        <head>
          <title>Payment Status</title>
          <script>
            window.onload = function () {
              alert("${alertMessage}");
              window.location.href = "${process.env.FRONTEND_URL}/expense/expense.html?token=${token}";
            };
          </script>
        </head>
        <body></body>
      </html>
    `);
  } catch (error) {
    // console.error("Error fetching payment status:", err);
    logger.error(`Error in /payment route: ${error.message}`);
    res.status(500).send("Error verifying payment status.");
  }
};

