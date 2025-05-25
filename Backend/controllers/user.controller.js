import {User} from "../models/user.model.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

dotenv.config();

export const addUser = async(req, res) => {
    try{
        const {name, email, password} = req.body;
         if (!name || !email ||!password) {
            return res.status(500).json({ message: "Missing Fields!!" });
        }
        const isDuplicateEmail = await User.findAll({
            where: {
                email: email
            }
        })
        if(isDuplicateEmail.length> 0){
            return res.status(409).json({msg:"This Email already exist in DB"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        return res.status(201).json({data: user});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json("Something went wrong");
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({userId: id, name:name}, process.env.JWT_SECRECT)
}

export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({
            where: {
                email:email
            }
        })
        if(!user) {
            return res.status(404).json({success:false, msg:"User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            return res.status(401).json({ success: false, msg: "User not authorized" });
        }
        return res.status(200).json({success: true, msg: "User login sucessful", user_id:user.id, token: generateAccessToken(user.id, user.name)});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, msg: "Something went wrong"});
    }
}