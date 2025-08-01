import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
 
        orderStatus: {
          type: String,
          required: true,
          enum: ["Pending", "Shipped", "Delivered", "Cancelled","Returned"],
          default: "Pending",
        },

        payment_id:{
          type:String
      },
      
      payment_status: {
          type: String,
          required: true,
          enum: ["Pending", "Paid", "Failed",],
          default: "Pending",
      },
      payment_Method :{
        type: String,
      },

      ReturnReason :{
        type: String
      },

      discount:{
          type:Number
      },

      offer:{
          type:Number
      },

      payableAmount:{
          type:Number,
      },

        itemCreatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", orderSchema);
export default Orders;
