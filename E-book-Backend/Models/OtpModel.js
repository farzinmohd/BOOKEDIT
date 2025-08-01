import mongoose from 'mongoose'

const otpScheama = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    otpExpiresAt : {
        type : Date,
        expires: '1m',
        required : true
    }
})

const Otp = mongoose.model("Otp",otpScheama)
export default Otp