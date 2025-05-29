import { Router } from "express";
import { resetPassword } from "../controllers/password.controller.js";

const router = Router();

router.post("/forgotpassword", resetPassword)


export {router};
