
import { sendResetPasswordEmail } from '../services/forgotPassword.js';



export const resetPassword = async (req, res) => {
 
  try {
     const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

    // const resetToken = "generated-token"; // generate securely in production
    // const resetLink = `https://your-frontend.com/reset-password?token=${resetToken}`;
    const resetLink = "https://www.google.com/";

    await sendResetPasswordEmail(email, resetLink);

    return res.status(200).json({ msg: "Reset password email sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Failed to send email" });
  }
};



