import {Router} from "express";
import { authenticate } from "../middlewares/auth.js";
import { dailyReport, getFilteredReport, downloadPDFReport } from "../controllers/report.controller.js";


const router = Router();

router.get("/dailyreport",authenticate, dailyReport);
router.get("/:type",authenticate, getFilteredReport);
router.get("/download/pdf/:type",authenticate, downloadPDFReport);


export {router};