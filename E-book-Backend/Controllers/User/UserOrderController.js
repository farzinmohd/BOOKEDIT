import Cart from "../../Models/CartModel.js";
import Orders from "../../Models/OrderModel.js";
import Products from "../../Models/ProductModel.js";
import mongoose from "mongoose";
import Offer from "../../Models/OfferModel.js";
import razorpayInstance from "../../Config/razorpay.js";
import crypto from "crypto";


/**
 * getting offer
 */
 
const getOffer = async (product_id) => {
  try {
    const product = await Products.findById(product_id);

    if (!product) {
      throw new Error(`Product with ID ${product_id} not found`);
    }

    const offerForProduct = await Offer.find({
      discountTarget: { $in: [product_id] },
      status: true,
      expireDate: { $gt: Date.now() },
    });

    const offerForCategory = await Offer.find({
      discountTarget: { $in: [product.category] },
      status: true,
      expireDate: { $gt: Date.now() },
    });

    const allOffers = [...offerForProduct, ...offerForCategory];

    const largestOffer = allOffers.reduce(
      (max, current) => (current.offer > max ? current.offer : max),
      0
    );

    return largestOffer;
  } catch (error) {
    console.error("Error in getOffer:", error.message);
    throw error;
  }
};

/**
 * order placing
 */

const PlaceOrder = async (req, res) => {
  const { cartSave, address_id, paymentMethod, totalPrice, couponDiscount } =
    req.body;

    
    console.log('address_id', address_id)

  const user_id = req.userId;
  const discountApplied = couponDiscount / cartSave.length;
  const totalAmount = Math.round(totalPrice);

  try {
    if (paymentMethod === "cashOnDelivery") {
      let order = await Orders.findOne({ user_id });
      console.log("Existing Order:", order);
      console.log('cash on delivery paymentMethod', paymentMethod)

      const OrderItemsWithOffers = await Promise.all(
        cartSave.map(async (cartItem) => {
          console.log("Processing Cart Item:", cartItem);
          const offerApplied = await getOffer(cartItem.product_id);
          const payableAmount =
            cartItem.totalPrice -
            ((offerApplied + discountApplied) / 100) * cartItem.totalPrice;
          console.log(
            "Offer Applied:",
            offerApplied,
            "Payable Amount:",
            payableAmount,
            paymentMethod
          );
   
          return {
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            discount: discountApplied,
            offer: offerApplied,
            payableAmount:payableAmount,
            order_status: "Pending",
            payment_status: "Pending",
            payment_Method:paymentMethod
          };
        })
      );

      if (order) {
        order.address_id = address_id;
        order.items.push(...OrderItemsWithOffers);
        await order.save();
        console.log("Updated Order:", order);
      } else {
        const OrderItemsWithOffers = await Promise.all(
          cartSave.map(async (cartItem) => {
            console.log("Processing Cart Item:", cartItem);
            const offerApplied = await getOffer(cartItem.product_id);
            const payableAmount =
              cartItem.price -
              ((offerApplied + discountApplied) / 100) * cartItem.price;
            console.log(
              "Offer Applied:",
              offerApplied,
              "Payable Amount:",
              payableAmount,
              paymentMethod
            );

            return {
              product_id: cartItem.product_id,
              quantity: cartItem.quantity,
              price: cartItem.price,
              discount: discountApplied,
              offer: offerApplied,
              payableAmount: payableAmount,
              order_status: "Pending",
              payment_status: "Pending",
              payment_Method: paymentMethod
            };
          })
        );

        order = await Orders.create({
          user_id,
          items: OrderItemsWithOffers,
          address_id,
        });
        console.log("Order Created:", order);
      }

      await Promise.all(
        cartSave.map(async (cartItem) => {
          await Cart.findOneAndUpdate(
            { user_id },
            { $pull: { items: { product_id: cartItem.product_id } } }
          );
          await Products.findOneAndUpdate(
            { _id: cartItem.product_id },
            { $inc: { stock: -cartItem.quantity } }
          );
        })
      );

      return res.status(200).json({ message: "Order placed successfully" });
    } else if (paymentMethod === "razorpay") {
      console.log("Processing Razorpay payment...");
    console.log('payment_Method', paymentMethod)

      const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);
      console.log("Razorpay Order:", razorpayOrder);


      return res.status(200).json({ order: razorpayOrder });
    }
  } catch (error) {
    console.error("Error in PlaceOrder:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

// Verify Payment Controller
const VerifyPayment = async (req, res) => {
  try {
    const user_id = req.userId;
    const {
      payment_id,
      address_id,
      order_id,
      signature,
      cartSave,
      couponDiscount,
      paymentMethod
    } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const discountApplied = couponDiscount / cartSave.length;
    let order = await Orders.findOne({ user_id });

    const itemsWithOffers = await Promise.all(
      cartSave.map(async (cartItem) => {
        const offerApplied = await getOffer(cartItem.product_id);
        console.log("check payable amount ",cartItem.totalPrice)
        const payableAmount =
          cartItem.totalPrice -
          ((offerApplied + discountApplied) / 100) * cartItem.totalPrice;

          console.log('check order payableAmount', payableAmount)

        return {
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          price: cartItem.price,
          discount: discountApplied,
          offer: offerApplied,
          payableAmount:payableAmount,
          order_status: "Pending",
          payment_status: "Paid",
          payment_id:payment_id,
          payment_Method:paymentMethod
        };
      })
    );

    if (order) {
      order.address_id = address_id;
      order.items.push(...itemsWithOffers);
      await order.save();
    } else {
      const itemsWithOffers = await Promise.all(
        cartSave.map(async (cartItem) => {
          const offerApplied = await getOffer(cartItem.product_id);
          const payableAmount =
            cartItem.totalPrice -
            ((offerApplied + discountApplied) / 100) * cartItem.totalPrice;

          return {
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            discount: discountApplied,
            offer: offerApplied,
            payableAmount:payableAmount,
            order_status: "Pending",
            payment_status: "Paid",
            payment_id: payment_id,
            payment_Method : paymentMethod
          };
        })
      );

      order = await Orders.create({
        user_id,
        items: itemsWithOffers,
        address_id,
      });
    }

    // Remove items from the cart and update stock
    await Promise.all(
      cartSave.map(async (cartItem) => {
        await Cart.findOneAndUpdate(
          { user_id },
          { $pull: { items: { product_id: cartItem.product_id } } }
        );
        await Products.findOneAndUpdate(
          { _id: cartItem.product_id },
          { $inc: { stock: -cartItem.quantity } }
        );
      })
    );

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Update payment status
    await Orders.updateOne(
      { user_id },
      { $set: { "items.$[item].payment_status": "Paid" } },
      { arrayFilters: [{ "item.payment_id": payment_id }] }
    );
    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
    });
  } catch (error) {
    console.error("Error in VerifyPayment:", error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

/**
 *  order payment is failed
 */


const failedPayment = async (req, res) => {
  console.log("Starting failedPayment function");

  try {
    const user_id = req.userId;
    const { couponDiscount, cartSave, payment_id, paymentMethod, address_id } = req.body;

    if (!cartSave || !Array.isArray(cartSave) || cartSave.length === 0) {
      return res.status(400).json({ message: "Invalid cart data" });
    }
    if ( !paymentMethod) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const discountApplied = couponDiscount / cartSave.length;
    let order = await Orders.findOne({ user_id });

    if (order) {
      // Update existing order
      const OrderItemsWithOffers = await Promise.all(
        cartSave.map(async (cartItem) => {
          try {
            const offerApplied = await getOffer(cartItem.product_id);
            const payableAmount =
              cartItem.price -
              ((offerApplied + discountApplied) / 100) * cartItem.price;

            return {
              product_id: cartItem.product_id,
              quantity: cartItem.quantity,
              price: cartItem.price,
              discount: discountApplied,
              offer: offerApplied,
              payableAmount: payableAmount,
              order_status: "Pending",
              payment_status: "Pending",
              payment_id: payment_id,
              payment_Method: paymentMethod,
            };
          } catch (error) {
            console.error(`Error processing item ${cartItem.product_id}:`, error);
            throw error;
          }
        })
      );

      order.items.push(...OrderItemsWithOffers);
      await order.save();
    } else {
      // Create a new order
      const OrderItemsWithOffers = await Promise.all(
        cartSave.map(async (cartItem) => {
          const offerApplied = await getOffer(cartItem.product_id);
          const payableAmount =
            cartItem.price -
            ((offerApplied + discountApplied) / 100) * cartItem.price;
          return {
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            discount: discountApplied,
            offer: offerApplied,
            payableAmount: payableAmount,
            order_status: "Pending",
            payment_status: "Pending",
            payment_id: payment_id,
            payment_Method: paymentMethod
          };
        })
      );

      order = await Orders.create({
        user_id,
        items: OrderItemsWithOffers,
        address_id
      });
      console.log("Created new order:", order);
    }

    // Update cart and stock
    await Promise.all(
      cartSave.map(async (cartItem) => {
        try {
          await Cart.findOneAndUpdate(
            { user_id },
            { $pull: { items: { product_id: cartItem.product_id } } }
          );
          await Products.findOneAndUpdate(
            { _id: cartItem.product_id },
            { $inc: { stock: -cartItem.quantity } }
          );
        } catch (error) {
          console.error(`Error updating cart or stock for ${cartItem.product_id}:`, error);
          throw error;
        }
      })
    );

    console.log("Cart and stock updated successfully");
    res.status(200).json({ message: "Order placed successfully, payment pending" });
  } catch (error) {
    console.error("Error in failedPayment:", error);
    res.status(500).json({ message: "Failed to process payment failure", error });
  }
};

/**
 * retrying payment
 */

const retryingPayment = async (req, res) => {
  try {
    const {order_id, amount  } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ order, order_id });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

/**
 * verify trying payment
 */


const verifyRetry = async (req, res) => {
  try {
    const { payment_id, razorpay_order_id, signature, orderId, cartSave } = req.body;
    console.log('cartSave check check this ', cartSave)
    console.log('orderId check check this ', orderId)
    const user_id = req.userId;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${payment_id}`)
      .digest("hex");

    // const matchedOrder = await Orders.findOne({
    //   user_id: user_id,
    //   "items._id": orderId,
    // });
    // console.log("Matched Order Before Update:", matchedOrder);

    if (generatedSignature === signature) {
      console.log("Signature matched, processing payment and stock update");

      // Update order payment status
      await Orders.updateOne(
        { user_id: user_id, "items._id": orderId },
        {
          $set: {
            "items.$.payment_status": "Paid",
            "items.$.payment_id": payment_id,
          },
        }
      );

      console.log("ffscdcdfcwaecscasdtgyhtne33e4r5tgyhtnbg ")
      // Update cart and stock
      await Promise.all(
        cartSave.map(async (cartItem) => {
          try {
            // Remove item from the cart
            // await Cart.findOneAndUpdate(
            //   { user_id },
            //   { $pull: { items: { product_id: cartItem.product_id } } }
            // );

            console.log("check check check check check check check")

            // Reduce product stock
            await Products.findOneAndUpdate(
              { _id: cartItem.product_id },
              { $inc: { stock: -cartItem.quantity } }
            );
          } catch (error) {
            console.error(
              `Error updating cart or stock for ${cartItem.product_id}:`,
              error
            );
            throw error;
          }
        })
      );

      res.status(200).json({
        success: true,
        message: "Payment verified successfully, stock updated",
      });
    } else {
      console.log("Signature verification failed");
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/**
 * get order detailes
 */

const getOrders = async (req, res) => {
  try {
    const user_id = new mongoose.Types.ObjectId(req?.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orderitems = [
      { $match: { user_id } },
      { $unwind: "$items" },
      { $sort: { "items.itemCreatedAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "addresses",
          localField: "address_id",
          foreignField: "_id",
          as: "address_id",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product_id",
          foreignField: "_id",
          as: "items.product_id",
        },
      },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          address_id: { $first: "$address_id" },
          items: { $push: "$items" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
    ];

    const orderItems = await Orders.aggregate(orderitems);

    const totalProducts = await Orders.countDocuments({ user_id });
    const totalPage = Math.ceil(totalProducts / limit);
    const currentPage = page;

    res.status(200).json({
      message: "Orders placed successfully",
      orderItems,
      totalPage,
      currentPage,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to placed orders",
      error: error.message,
    });
  }
};

/**
 * user cancel order
 */

const CancelOrder = async (req, res) => {
  try {
    const user_id = req.userId;
    const { product_id, quantity, order_id } = req.body;
    console.log('product_id, quantity, order_id', product_id, quantity, order_id)
    const order = await Orders.findOneAndUpdate(
      { user_id: user_id, _id: order_id, "items.product_id": product_id },
      { $set: { "items.$.orderStatus": "Cancelled" } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Products.findByIdAndUpdate(product_id, {
      $inc: { stock: quantity },
    });
    res.status(200).json({ message: "Order Cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Order cancellation failed", error });
  }
};




/**
 * User home Page getting top ten products
 */

const GetTopTenProducts = async (req, res) => {
  try {
    const topProducts = await Orders.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          orderCount: { $sum: 1 },
          totalQuantitySelled: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.payableAmount" },
        },
      },
      { $sort: { totalQuantitySelled: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.productName",
          category: "$productDetails.category",
          author: "$productDetails.author",
          image: "$productDetails.images",
          price: "$productDetails.price"

        },
      },
    ]);
    res.status(200).json({ message: "success", topProducts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "internal server error" });
  }
};

/**
 * User home page getting top category
 */

const TopCategory = async (req, res) => {
  try {
    const topCategory = await Orders.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalOrder: { $sum: 1 },
          totalQuantitySelled: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.payableAmount" },
        },
      },
      { $sort: { totalQuantitySelled: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalOrder: 1,
          totalQuantitySelled: 1,
          totalRevenue: 1,
        },
      },
    ]);

    console.log('topCategory check check', topCategory)

    res
      .status(200)
      .json({ message: "Get top category successful", topCategory });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Internal server error" });
  }
};





const ReturnOrder = async (req, res) => {
  try {

    console.log("fm;isdhvluifhfipuhnerlifbefilbleafinerlifbnerl;ifninjf ikrn")
    const { ReturnReason, product_id, order_id, quantity } = req.body;

    console.log('product_id, quantity, order_id, ReturnReason', product_id, quantity, order_id, ReturnReason);
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const itemIndex = order.items.findIndex(item => item.product_id.toString() === product_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in the order' });
    }

    order.items[itemIndex].returnStatus = 'Returned';  
    order.items[itemIndex].returnReason = ReturnReason;  


    const product = await Product.findById(product_id);
    if (product) {

      await product.save();
    }

    await order.save();

    res.status(200).json({ message: 'Order returned successfully', order });
  } catch (error) {
    console.error("Error during order return:", error);
    res.status(500).json({ message: 'Something went wrong while returning the order' });
  }
};


export {
  PlaceOrder,
  getOrders,
  CancelOrder,
  VerifyPayment,
  failedPayment,
  retryingPayment,
  verifyRetry,
  GetTopTenProducts,
  TopCategory,
  ReturnOrder
};
