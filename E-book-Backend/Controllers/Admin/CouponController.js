import Coupon from "../../Models/CouponModel.js";

/**
 * admin create new  coupon
 */

const AddCoupon = async (req, res) => {
  try {
    const {
      couponCode,
      couponName,
      startDate,
      expireDate,
      offer,
      description,
      minimumAmount,
    } = req.body;
    console.log("req.body", req.body);
    console.log(
      "couponName, startDate, expireDate, offer, description:",
      couponCode,
      couponName,
      startDate,
      expireDate,
      offer,
      description
    );

    if (new Date(expireDate) <= Date.now()) {
      return res
        .status(401)
        .json({ message: "Expire date cannot be today or earlier" });
    }

    // const existCoupon = await Coupon.findOne({
    //   couponName: { $regex: new RegExp(`^${couponName}$`, "i") },
    // });

    const existCoupon = await Coupon.findOne({ couponCode });
    if (existCoupon) {
      return res
        .status(401)
        .json({ message: "The coupon name already exists" });
    }

    const coupon = await Coupon.create({
      couponCode,
      couponName,
      description,
      minimumAmount,
      offer,
      startDate,
      expireDate,
    });

    res.status(200).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Coupon creation failed" });
  }
};

/**
 * get admin coupon list
 */

const getCouponList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const couponsData = await Coupon.find().skip(skip).limit(limit);
    const totalCoupons = await Coupon.countDocuments();
    const totalPage = Math.ceil(totalCoupons / limit);
    const currentPage = page;

    res.status(200).json({
      message: "get coupons successfully ",
      couponsData,
      totalCoupons,
      totalPage,
      currentPage,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * block unblock coupon
 */

const BlockCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("id", id);

    if (id) {
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { $set: { status: !coupon.status } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Success", coupon: updatedCoupon });
    } else {
      return res.status(400).json({ message: "Invalid or missing coupon ID" });
    }
  } catch (error) {
    console.error("Error in BlockCoupon:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * admin delete coupon
 */
const DeleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * admin edit coupon
 */
const EditCoupon = async (req, res) => {
  const { id } = req.params;
  const {
    couponCode,
    couponName,
    startDate,
    expireDate,
    offer,
    description,
    minimumAmount,
  } = req.body;

  try {
    if (new Date(expireDate) <= Date.now()) {
      return res
        .status(401)
        .json({ message: "Expire date cannot be today or earlier" });
    }

    const existCoupon = await Coupon.findOne({ 
      couponCode, 
      _id: { $ne: id } 
    });
    if (existCoupon) {
      return res
        .status(401)
        .json({ message: "The coupon code already exists" });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      {
        couponCode,
        couponName,
        description,
        minimumAmount,
        offer,
        startDate,
        expireDate,
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export { AddCoupon, getCouponList, BlockCoupon, DeleteCoupon, EditCoupon };
