// import dotenv from 'dotenv';
// import SibApiV3Sdk from 'sib-api-v3-sdk';


// dotenv.config();
// console.log('Using API key:', process.env.SENDINBLUE_API_KEY);

// const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
// apiKey.apiKey = process.env.SENDINBLUE_API_KEY;


// const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// export const sendResetPasswordEmail = async (toEmail, resetLink) => {
//   try {
//     const sendSmtpEmail = {
//       sender: { name: "Expense Tracker Application", email: "manikant21032001@gmail.com" },
//       to: [{ email: toEmail }],
//       subject: "Reset Your Password",
//       htmlContent: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
//     };

//     const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("Reset email sent:", data);
//     return data;
//   } catch (error) {
//     console.error("Failed to send reset email:", error);
//     throw error;
//   }
// };


// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'martina.parker@ethereal.email',
//         pass: 'tqbcjc6kHFYk6whAjX'
//     }
// });


import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: "martina.parker@ethereal.email",
    pass: "tqbcjc6kHFYk6whAjX",
  },
});


export const sendResetPasswordEmail = async (toEmail, resetLink) => {
  try {
    const mailOptions = {
      from: `"Expense Tracker App" <martina.parker@ethereal.email>`,
      to: toEmail,
      subject: "Reset Your Expense Tracker Password",
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    throw error;
  }
};


// (async () => {
//   try {
//     const info = await transporter.sendMail({
//       from: '"Martina Parker" <maddison53@ethereal.email>',
//       to: "bar@example.com, baz@example.com",
//       subject: "Hello ✔",
//       text: "Hello world?",
//       html: "<b>Hello world?</b>", 
//     });

//     console.log("Message sent:", info.messageId);
//   } catch (error) {
//     console.error("Error sending mail:", error);
//   }
// })();

