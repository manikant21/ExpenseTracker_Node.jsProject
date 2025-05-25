import { Router } from "express";
import { deleteExpense, getExpense , insertExpense, editExpense} from "../controllers/expense.controller.js";

const router = Router();

router.get("/:userId", getExpense);
router.post("/add", insertExpense);
router.delete("/:userId/delete/:id", deleteExpense);
router.put("/edit/:id", editExpense);

export {router};