import mongoose, { Schema } from 'mongoose';


const walletSchema = mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    balance_amount: {
      type: Number,
      required: true,
    //   default: 0,
    },
    data: [
      {
        order_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order', 
        },
        items: {
          type: String,
        },
        amount: {
          type: Number,
        },
        date: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
  },
  { timestamps: true }
);


walletSchema.pre('save', function (next) {
  if (this.isModified('data')) {

    this.balance_amount = this.data.reduce((acc, item) => acc + item.amount, 0);
  }
  next();
});




walletSchema.methods.creditAmount = async function (amount, description, orderId = null) {

  const transaction = {
    order_id: orderId,  
    items: description || 'Credit Transaction',  
    amount: amount, 
    date: new Date(),  
  };


  this.data.push(transaction);


  this.balance_amount = this.data.reduce((acc, item) => acc + item.amount, 0);


  await this.save();

  return this;
};

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;







// import mongoose, { Schema } from 'mongoose'

// const walletSchema = mongoose.Schema({
//     user_id:{
//         type:Schema.Types.ObjectId,
//         required: true 
//     },
//     balance_amount:{
//         type:Number,
//         required:true,
//     },
//     data:[
//         {
//             order_id:{
//                 type:mongoose.Schema.Types.ObjectId,
//             },
//             items:{
//                 type: String,
//             },
//             amount:{
//                 type:Number,
//             },
//             date:{
//                 type: Date
//             }
//         }
//     ]
// }, {timestamps: true});

// walletSchema.pre("save", function (next){
//     this.balance_amount = this.data.reduce((acc,item)=>{
//         return acc + item.amount
//     },0);

//     this.UpdatedAt = Date.now();
//     next();
// });

// const Wallet = mongoose.model('Wallet', walletSchema)
// export default Wallet