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