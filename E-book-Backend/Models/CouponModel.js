import mongoose from 'mongoose'

const couponSchema = mongoose.Schema({
    couponName:{
        type:String,
        required: true
    },
    couponCode:{
        type:String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    users: [
        {
          user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            
          },
          couponCode: {
            type: String,
          },
          status: {
            type: Boolean,
            default: false,
          },
          _id: false,
        },
      ],
      
    description:{
        type:String,
        required: true
    },
    offer:{
        type:Number,
        required: true
    },
    minimumAmount:{
        type:Number,
        required: true
    },
    startDate:{
        type:Date,
        required: true
    },
    expireDate:{
        type:Date,
        required: true,
    },
    status:{
        type:Boolean,
        default: true
    }
}, { timestamps: true})



const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon