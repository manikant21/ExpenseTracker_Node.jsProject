import { Cashfree, CFEnvironment } from "cashfree-pg";
import { Order } from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

export const createOrder = async (orderId, amount, currency="INR", customerID, customerPhone) => {
  try {
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: String(customerID),
        customer_phone: customerPhone,
        customer_email: "sample@email.com", 
      },
      order_meta: {
        return_url: `http://3.108.55.19:3000/api/v1/payment/status/${orderId}`,
        // return_url: `http://localhost:3000/api/v1/payment/status/${orderId}`,
        // return_url: `http://expensetracker-env.eba-ex3dcvcn.ap-south-1.elasticbeanstalk.com/api/v1/payment/status/${orderId}`,
        // notify_url: "http://expensetracker-env.eba-ex3dcvcn.ap-south-1.elasticbeanstalk.com/api/v1/payment/webhook",
        notify_url : "http://3.108.55.19:3000/api/v1/payment//payment/webhook",
        payment_methods: "cc,dc,upi" 
      },
      order_expiry_time: expiry,
    };

    const response = await cashfree.PGCreateOrder(orderData);
    return response.data.payment_session_id;


  } catch (err) {
    console.error("Cashfree Order Error:", err.response?.data || err.message);
    throw new Error("Unable to create Cashfree order.");
  }
};


export const getOrderStatus = async (orderId) => {
  try {
    const response = await cashfree.PGFetchOrder(orderId);
    return response.data.order_status; 
  } catch (error) {
    console.error("Error fetching order status:", error.response?.data || error.message);
    throw error;
  }
};
