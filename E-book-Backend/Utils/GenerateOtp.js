import crypto from "crypto";
import Otp from "../Models/OtpModel.js";
/*
generate otp 
*/

const GenerateOtp = async (user) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = Date.now();
    const id = user._id || user.userId;
    console.log("check id ", id);
  
    const newOtp = new Otp({
      userId: id,
      otp,
      otpExpiresAt,
    });
  
    await newOtp.save();
    return otp;
  };

  export { GenerateOtp }
   