import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            _id: false
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

cartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    next();
});

// cartSchema.pre('findOneAndUpdate', function (next) {
//     // Get the updated items list
//     const updatedItems = this.getUpdate().$set.items;

//     if (updatedItems) {
//         this.getUpdate().$set.totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     }
//     next();
// });


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

