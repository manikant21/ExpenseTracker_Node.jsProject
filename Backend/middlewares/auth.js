import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from 'dotenv'

dotenv.config();

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log(user.userId);
        const users = await User.findByPk(user.userId);
        if(!users) {
            return res.status(401).json({success: false});
        }
        req.user= users;  //very imp.
        next();


    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Something went wrong"});
    }
}