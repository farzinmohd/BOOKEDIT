import mongoose from "mongoose";

const productScheama = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true,
  },
  stock:{
    type: Number,
    required: true,
  },
  author:{
    type: String,
    required: true,
  },
  description:{
    type : String,
    required: true,
  },
  category:{
    type : String,
    required: true,
  },
  publisher:{
    type : String,
    required: true,
  },
  images: {
    type : Array,
    required: true,
  },
  language: {
    type : String,
    required: true,
  },
  review:{
    type : Array,
    required: true,
  },
  status:{
    type : Boolean,
    default: true,
  }
},{ timestamps: true });

const Products = mongoose.model('Products',productScheama)
export default Products