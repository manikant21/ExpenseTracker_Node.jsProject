import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/db.config.js";
import {router as userRoute} from "./routes/user.route.js";
import { router as expenseRouter } from "./routes/expense.route.js";
import cors from "cors";


dotenv.config();

const app = express();


app.use(cors({origin: "*"}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/expense", expenseRouter);
await sequelize.sync();

app.listen(PORT, () => {
        console.log(`Server is up and running at ${PORT}`);
    });
    