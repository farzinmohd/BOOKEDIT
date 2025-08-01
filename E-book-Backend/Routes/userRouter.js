import express from "express";
const userRouter = express.Router();
import {
  Register,
  ResendOtp,
  VerifyOtp,
  Login,
  GoogleLogin,
  UserProfile,
  Logout,
  RefreshingToken,
  UserEditInfo,
  ChangePassword,
  AddAddress,
  GetAddress,
  EditAddress,
  DeleteAddress,
  DeleteUserAccount,
} from "../Controllers/User/UserController.js";
import {
  ProductDetails,
  ListProduct,
} from "../Controllers/User/UserProductController.js";
import { VerifyToken } from "../Middlewares/VerifyToken.js";
import {
  AddCart,
  GetCartItems,
  DeleteCartProduct,
} from "../Controllers/User/CartController.js";
import {
  PlaceOrder,
  getOrders,
  CancelOrder,
  VerifyPayment,
  failedPayment,
  retryingPayment,
  verifyRetry,
  GetTopTenProducts,
  TopCategory,
  ReturnOrder,
} from "../Controllers/User/UserOrderController.js";
import {
  ActiveCoupons,
  ApplyCoupon,
} from "../Controllers/User/UserCouponController.js";

import {
  AddWhishList,
  whishList,
  RemoveWishList,
} from "../Controllers/User/WhishlistController.js";

import {
  getWallet,
  addWallet,
} from "../Controllers/User/UserWalletController.js";

/**
 * GET
 */

userRouter.get("/Products-details", ProductDetails);
userRouter.get("/list-Products", ListProduct);
userRouter.get("/refresh-token", RefreshingToken);
userRouter.get("/userProfile", VerifyToken, UserProfile);
userRouter.get("/user-address", VerifyToken, GetAddress);
userRouter.get("/get-cart-items", VerifyToken, GetCartItems);
userRouter.get("/get-order-items", VerifyToken, getOrders);
userRouter.get("/active-coupons", VerifyToken, ActiveCoupons);
userRouter.get("/get-whishlist", VerifyToken, whishList);
userRouter.get("/get-wallet", VerifyToken, getWallet);
userRouter.get("/get-top-category", TopCategory);
userRouter.get("/get-top-products", GetTopTenProducts);


/**
 * POST
 */

userRouter.post("/register", Register);
userRouter.post("/verifyOtp", VerifyOtp);
userRouter.post("/resendOtp", ResendOtp);
userRouter.post("/login", Login);
userRouter.post("/google-login", GoogleLogin);
userRouter.post("/logout", Logout);
userRouter.post("/edit-userInfo", VerifyToken, UserEditInfo);
userRouter.post("/change-password", VerifyToken, ChangePassword);
userRouter.post("/add-address", VerifyToken, AddAddress);
userRouter.post("/add-cart", VerifyToken, AddCart);
userRouter.post("/place-order", VerifyToken, PlaceOrder);
userRouter.post("/verify-payment", VerifyToken, VerifyPayment);
userRouter.post("/failed-order", VerifyToken, failedPayment);
userRouter.post("/retry-payment", VerifyToken, retryingPayment);
userRouter.post("/verify-retry", VerifyToken, verifyRetry);
userRouter.post("/add-whishlist", VerifyToken, AddWhishList);
userRouter.post("/add-wallet", VerifyToken, addWallet);
userRouter.post("/return-order-order", verifyRetry, ReturnOrder)

/**
 * PUT
 */

userRouter.put("/Edit-address", VerifyToken, EditAddress);
userRouter.put("/cancel-order", VerifyToken, CancelOrder);
userRouter.put("/apply-coupon", VerifyToken, ApplyCoupon);

/**
 * DELETE
 */

userRouter.delete("/delete-address", VerifyToken, DeleteAddress);
userRouter.delete("/delete-cart-product", VerifyToken, DeleteCartProduct);
userRouter.delete("/delete-whishlist-products", VerifyToken, RemoveWishList);
userRouter.delete("/delete-account", VerifyToken, DeleteUserAccount);

export default userRouter;
