import mongoose from 'mongoose'

const whishlistScheama = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    items:[
        {
            product_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Products',
                required: true
            },

            itemCreatedAt:{
                type: Date,
                default: Date.now 
            },
            _id: false

        }
    ]
},{ timestamps: true});

const Whishlist = mongoose.model('Whishlist', whishlistScheama);
export default Whishlist