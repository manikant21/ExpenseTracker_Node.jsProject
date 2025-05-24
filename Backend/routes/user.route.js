import {Router} from "express";
import { addUser } from "../controllers/user.controller.js";


const router = Router();

router.post("/login", addUser);

export {router};
