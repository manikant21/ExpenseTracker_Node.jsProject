import {Router} from "express";
import { authenticate } from "../middlewares/auth.js";
import { dailyReport, getFilteredReport, downloadExpense} from "../controllers/report.controller.js";


const router = Router();

router.get("/dailyreport",authenticate, dailyReport);
router.get("/download", authenticate, downloadExpense);
router.get("/:type",authenticate, getFilteredReport);
// router.get("/download/pdf/:type",authenticate, downloadPDFReport);


export {router};