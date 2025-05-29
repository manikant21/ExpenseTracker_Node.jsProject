import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk';


dotenv.config();
console.log('Using API key:', process.env.SENDINBLUE_API_KEY);

const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;




const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendResetPasswordEmail = async (toEmail, resetLink) => {
  try {
    const sendSmtpEmail = {
      sender: { name: "Expense Tracker Application", email: "manikant21032001@gmail.com" },
      to: [{ email: toEmail }],
      subject: "Reset Your Password",
      htmlContent: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Reset email sent:", data);
    return data;
  } catch (error) {
    console.error("Failed to send reset email:", error);
    throw error;
  }
};