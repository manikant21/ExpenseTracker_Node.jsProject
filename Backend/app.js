import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { sequelize } from "./config/db.config.js";
import {router as userRoute} from "./routes/user.route.js";
import { router as expenseRouter } from "./routes/expense.route.js";
import { router as premiumRouter } from './routes/payment.route.js';
import {router as forgotPasswordRouter} from './routes/password.route.js';
import {router as reportRouter} from './routes/report.route.js';
import compression from "compression";
import cors from "cors";



dotenv.config();

const app = express();


app.use(cors({origin: "*"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cookieParser());
app.use(compression())
const PORT = process.env.PORT || 5000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/payment", premiumRouter);
app.use("/api/v1/password", forgotPasswordRouter);
app.use("/api/v1/report", reportRouter);

await sequelize.sync();

app.listen(PORT, () => {
        console.log(`Server is up and running at ${PORT}`);
    });
