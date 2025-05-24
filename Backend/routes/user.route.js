import {Router} from "express";
import { addUser, loginUser} from "../controllers/user.controller.js";


const router = Router();

router.post("/register", addUser);
router.post("/login", loginUser);

export {router};
