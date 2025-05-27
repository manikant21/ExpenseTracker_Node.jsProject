import { Router } from "express";
import { deleteExpense, getExpense , insertExpense, editExpense} from "../controllers/expense.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { getTotalExpenseByEachUser } from "../controllers/expense.controller.js";

const router = Router();

router.get("/", authenticate, getExpense);
router.post("/add", authenticate ,insertExpense);
router.delete("/delete/:id", authenticate, deleteExpense);
router.put("/edit/:id", authenticate, editExpense);
router.get("/allexpensedetails",authenticate,  getTotalExpenseByEachUser);

export {router};