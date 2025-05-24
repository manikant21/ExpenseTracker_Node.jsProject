import User from "../models/user.model.js";


export const addUser = async(req, res) => {
    try{
        const {name, email, password} = req.body;
        const isDuplicateEmail = await User.findAll({
            where: {
                email: email
            }
        })
        if(isDuplicateEmail.length> 0){
            return res.status(409).json({msg:"This Email already exist in DB"});
        }
        const user = await User.create({
            name: name,
            email: email,
            password: password
        })
        return res.status(201).json({data: user});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json("Something went wrong");
    }
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
            return res.status(404).json({success:false, msg:"Invalid email"});
        }
        if(user.password !== password) {
            return res.status(401).json({success: false, msg: "Invalid password"});
        }
        return res.status(200).json({success: true, msg: "User Logged in succesfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, msg: "Something went wrong"});
    }
}