import { Router } from "express";
import {forgotPassword, resetPassword, updatePassword}  from "../controllers/password.controller.js";

const router = Router();

router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:id", resetPassword);
router.post("/updatepassword/:id", updatePassword);



export {router};
