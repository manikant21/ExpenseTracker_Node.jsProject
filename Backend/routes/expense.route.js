import { Router } from "express";
import { deleteExpense, getExpense , insertExpense, editExpense} from "../controllers/expense.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, getExpense);
router.post("/add", authenticate ,insertExpense);
router.delete("/delete/:id", authenticate, deleteExpense);
router.put("/edit/:id", authenticate, editExpense);

export {router};