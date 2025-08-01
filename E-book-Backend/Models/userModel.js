import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    username : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
   phone : {
        type : String,
        required: null,
    },
    password : {
        type : String,
        default : null
    },
    googleId : {
        type : String,
        unique : true,
        sparse : true,
    },
    isActive : {
        type : Boolean,
        default : true,
    },
    isVerified : {
        type : Boolean,
        required :true,
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    otp : {
        type : String
    },
    otpExpireAt : {
        type : Date
    },
    referralCode: {
        type: String,
        unique: true,
      },
      referredBy: {
        type: String,
      },

      referralRewards: [
        {
          reward: Number,
          status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

     role: {type: String, enum: [ 'user', 'admin'],default:'user'},
     profilePhotoUrl: {
  type: String,
  default: '',
},
     
},
{timestamps : true})


const User = mongoose.model('User',userSchema)
export default User