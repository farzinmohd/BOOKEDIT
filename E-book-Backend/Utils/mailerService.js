import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service : "Gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.PASS_EMAIL,
    },

 
})

const sendVerificationMail = async (user, otp) =>{
  console.log("check",user,otp);
  
    const mailOption = {
        // from: "ebook@gmail.com",
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your email - OTP",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
              <p>Dear ${user.username},</p>
              <p>Thank you for registering with ebook. To complete your registration, please use the OTP below to verify your email address:</p>
              <div style="text-align: center; padding: 10px 0;">
                <span style="display: inline-block; padding: 10px 20px; font-size: 35px; letter-spacing:30px; border-radius: 5px;">
                  ${otp}
                </span>
              </div>
              <p>This OTP is valid for <strong>1 minutes</strong>. If it expires, please request a new OTP.</p>
              <p>Best regards,<br><strong>ebook Team</strong></p>
              <hr style="border-top: 1px solid #eee; margin-top: 20px;" />
              <small style="color: #999;">If you didn't request this, please ignore this email.</small>
            </div>
          </div>
       `,
    }
    try {
        await transporter.sendMail(mailOption)
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification Email ",error.message);
        throw new Error("otp send failed. please try again");
        
        
    }
}


export default sendVerificationMail