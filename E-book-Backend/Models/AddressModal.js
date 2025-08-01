import mongoose from "mongoose";

const addressScheama = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  locality: {
    type : String,
    required: true
  },
  address: {
    type : String,
    required: true
  },
  city: {
    type : String,
    required: true
  },
  state: {
    type : String,
    required: true
  },
  landmark: {
    type : String,
    default: null
  },
  altPhone: {
    type : Number,
    default: null
  },
  addressType: {
    type : String,
    enum : ['home','work'],
    default: 'home'
  }
},{timestamps: true});

const Address = mongoose.model('Address',addressScheama);
export default Address
