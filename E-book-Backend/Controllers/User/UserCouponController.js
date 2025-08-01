import mongoose from "mongoose";
import Coupon from "../../Models/CouponModel.js";

/**
 * for getting active coupons
 */


const ActiveCoupons = async (req, res) => {
    try {
      const user_id = req.user_id;
      const coupons = await Coupon.find({ status: true }).sort({ createdAt: -1 });
      const filteredCoupons = coupons.map((coupon) => {
        const user = coupon.users.find((user) => user.user_id?.toString() === user_id?.toString());
        return user
          ? { ...coupon.toObject(), user } 
          : { ...coupon.toObject(), user: null }; 
      });
  
      res.status(200).json({
        message: "Getting coupons successfully",
        coupons: filteredCoupons,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Getting coupons failed" });
    }
  };

  /**
   * user apply coupon 
   */

  const ApplyCoupon = async (req, res) => {
    try {
      const user_id = new mongoose.Types.ObjectId(req.userId);
      const { couponCode } = req.body;
      const normalizedCouponCode = couponCode.toUpperCase();
  

  
      // Find the coupon
      const coupon = await Coupon.findOne({ couponCode: normalizedCouponCode });
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
  
      // Check if the coupon is expired
      if (new Date(coupon.expireDate) < new Date()) {
        return res.status(400).json({ message: "The coupon is expired" });
      }
  
      // Find the user in the coupon's users array
      const userIndex = coupon.users.findIndex(
        (user) =>
          user.user_id.toString() === user_id.toString() &&
          user.couponCode === normalizedCouponCode
      );
  
      if (userIndex === -1) {
        // If the user is not in the users array, add them
        coupon.users.push({
          user_id,
          couponCode: normalizedCouponCode,
          status: true, // Mark as applied
        });
        await coupon.save();
  
        return res.status(200).json({
          message: "Coupon applied successfully",
          coupon,
        });
      } else {
        // If the user exists, toggle the status
        const user = coupon.users[userIndex];
        user.status = !user.status;
        await coupon.save();
  
        const message = user.status
          ? "Coupon applied successfully"
          : "Coupon canceled successfully";
  
        return res.status(200).json({
          message,
          coupon,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Failed to apply or cancel coupon" });
    }
  };
  
  
//   const ApplyCoupon = async (req,res) =>{
//     try {
//         const user_id = req.userId;
//         const { couponCode } = req.body;
//     //    const user_id = mongoose.Types.ObjectId(req.userId); // Ensure ObjectId format


//         console.log('user_id', user_id)
//         console.log('couponCode', couponCode)
// //       const normalizedCouponCode = couponCode.toUpperCase(); // Normalize input

//         const coupon = await Coupon.findOne({
//             users: { $elemMatch: { user_id, couponCode } },
//           });
      
//         // const coupon = await Coupon.findOne({ "users.user_id":user_id,"users.couponCode":couponCode})
//         console.log('coupon', coupon)
//         if (!coupon) {
//             return res.status(404).json({ message: "coupon  not fount" });
//         }
//         if (new Date(coupon.expireDate)< Date.now()) {
//             return req.status(404).json({ message: "the Coupon is expired"})
//         }
//         const user = coupon.users.find(users => users.couponCode === couponCode);
//         if (user.status) {
//             return req.status(404).json({ message: "coupon is expired or invalid"})
//         }
//         user.status = true;
//         await
//          coupon.save();
//          await res.status(200).json({ message: "coupon applied successfully", coupon })        
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ message: "coupon applied failed"})
//     }
//   }

export {
    ActiveCoupons,
    ApplyCoupon,

}