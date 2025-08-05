import { sequelize } from '../config/db.config.js';
import { sendResetPasswordEmail } from '../services/forgotPassword.js';
import { User } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordRequests } from '../models/forgotPasswordRequests.model.js';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';




export const forgotPassword = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: "Email is required" });
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        }, { transaction })
        if (!user) {
            await transaction.rollback();
            return res.status(400).json({ msg: "No such email present in DB" })
        }
        // console.log(user);
        const id = uuidv4();
        await ForgotPasswordRequests.create({
            id: id,
            isActive: true,
            userId: user.id,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }, { transaction })

            const resetLink = `http://13.203.193.183:3000/api/v1/password/${id}`        
        // const resetLink = `http://expensetracker-env.eba-ex3dcvcn.ap-south-1.elasticbeanstalk.com/api/v1/password/resetpassword/${id}`;

        await sendResetPasswordEmail(email, resetLink);

        await transaction.commit();
        return res.status(200).json({ msg: "Reset password email sent" });
    } catch (error) {
        // console.log(err);
        await transaction.rollback();
        logger.error(`Error in /password route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ msg: "Failed to send email" });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const passwordChange = await ForgotPasswordRequests.findOne({
            where: {
                id: id
            }
        })

        if (!passwordChange  || !passwordChange.isActive || new Date() > passwordChange.expiresAt) {
            return res.status(404).send('Invalid password reset link');
        }
        await passwordChange.update({
            isActive: false
        })
        return res.status(200).send(`
            <html>
                <head>
                    <title>Reset Password</title>
                </head>
                <body>
                    <form action="http://13.203.193.183:3000/api/v1/password/updatepassword/${id}" method="POST">
                        <label for="newpassword">Enter New Password:</label>
                        <input type="password" name="newpassword" required />
                        <button type="submit">Reset Password</button>
                    </form>
                </body>
            </html>
            `)

    } catch (error) {
        // console.log(error);
           logger.error(`Error in /password route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ msg: "Failed to Reset Password" });
    }
}


export const updatePassword = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { newpassword } = req.body;
        // console.log(newpassword);
        const { id } = req.params;
        // console.log(id);
        const forgotRequest = await ForgotPasswordRequests.findByPk(id);
        if(!forgotRequest) {
            await transaction.rollback();
            return res.status(404).json({msg: "Invalid Id for forgot request"})
        }
        const user = await User.findOne({
            where: {
                id: forgotRequest.userId
            }
        }, {transaction});

         if (!user) {
            await transaction.rollback();
            return res.status(404).json({ msg: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        await user.update({password: hashedPassword},{transaction});
        await transaction.commit();
        return res.redirect("https://expense-tracker-node-js-project.vercel.app/login/login.html");
        // return res.redirect("http://127.0.0.1:5501/Frontend/login/login.html");

    } catch (error) {
        // console.log(error);
        await transaction.rollback();
           logger.error(`Error in /password route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ msg: "Failed to  update new Password" });
    }
}





