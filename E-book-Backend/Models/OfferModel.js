import mongoose from 'mongoose'

const offerScheama = mongoose.Schema({
    offerName:{
        type:String,
        required:true
    },

    discountTarget: {
        type: String,
        enum: ["Category", "Product"],
        required: true,
      },

      targets: {
        type: [mongoose.Schema.Types.ObjectId], 
        refPath: 'discountTarget',
        required: true
      },

    offerType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
      },

      discountValue: {
        type: Number,
        required: true,
        min: 0,
      },

          
    description:{
      type:String,
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

})

const Offer = mongoose.model('Offer',offerScheama);

export default Offer