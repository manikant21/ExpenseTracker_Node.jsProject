import {Router} from "express";
import { addUser, loginUser, getUserStatus} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";


const router = Router();

router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/status", authenticate, getUserStatus);

export {router};
