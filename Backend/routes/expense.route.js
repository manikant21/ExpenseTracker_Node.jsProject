import { Router } from "express";
import { deleteExpense, getExpense , insertExpense, editExpense} from "../controllers/expense.controller.js";

const router = Router();

router.get("/", getExpense);
router.post("/add", insertExpense);
router.delete("/delete/:id", deleteExpense);
router.put("/edit/:id", editExpense);

export {router};