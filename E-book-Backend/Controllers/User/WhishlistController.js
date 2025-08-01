
import mongoose from 'mongoose';
import Whishlist from '../../Models/WhishlistModel.js'

// const AddWhishList = async (req,res)=>{
//   try {

//     console.log('check')
//     const {product_id} = req.body;
//     const user_id = req.userId;

//     console.log('product_id,user_id', product_id,user_id)
    
//     const whishlist = await Whishlist.findOne({user_id:user_id});
    
   
//     if (whishlist) {
//         whishlist.items.push({product_id});
//         await whishlist.save();
//     }else{
//         whishlist = await Whishlist.create({
//             user_id:user_id,
//             items:[{product_id}]
//         })
//     }
//     await res.status(200).json({ message: "whishlist add successfully"})
//   } catch (error) {
//     await res.status(200).json({ message: "whishlist add successfully"})
//   }
// }



const AddWhishList = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.userId;

    console.log('product_id, user_id:', product_id, user_id);
    let whishlist = await Whishlist.findOne({ user_id: user_id });

    if (whishlist) {
      const isDuplicate = whishlist.items.some(item => item.product_id.toString() === product_id);

      if (!isDuplicate) {
        whishlist.items.push({ product_id });
        await whishlist.save();
        return res.status(200).json({ message: "Product added to wishlist successfully" });
      } else {
        return res.status(400).json({ message: "Product already exists in wishlist" });
      }
    } else {
      whishlist = await Whishlist.create({
        user_id: user_id,
        items: [{ product_id }]
      });
      return res.status(200).json({ message: "Wishlist created and product added successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding product to wishlist" });
  }
};

export default AddWhishList;


/**
 * get whishlist 
 */

const whishList = async (req, res) => {
    try {
      const user_id = req.userId;
      const whishlist = await Whishlist.findOne({ user_id })
        .populate({
          path: 'items.product_id',
          select: '_id productName price stock description category origin images status', 
        })
        .lean(); 

      if (!whishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
      whishlist.items.sort((a, b) => new Date(b.itemCreatedAt) - new Date(a.itemCreatedAt));
  
      res.status(200).json({ message: 'Wishlist retrieved successfully', whishlist });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to retrieve wishlist' });
    }
  };
  


/**
 * remove whishlist  
 */

const RemoveWishList = async (req,res) =>{
    try {
        console.log("check remove id ")
        const user_id = req.userId;
        const {product_id} = req.body
        const whishlist = await Whishlist.findOneAndUpdate(
            {user_id:user_id},
            {$pull:{items:{product_id:product_id}}}
        )
        res.status(200).json({ message: "whishlist remove successfully" });
    } catch (error) {
        res.status(400).json({ message: "whishlist remove failed" });
    }
}

export {
    AddWhishList,
    whishList,
    RemoveWishList
}