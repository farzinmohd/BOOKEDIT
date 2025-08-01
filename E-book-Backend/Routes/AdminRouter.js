import express from "express";
const adminRouter = express();
import {
  AdminLogin,
  UserList,
  RefreshingToken,
  BlockUser,
  AddCategory,
  getCategory,
  BlockCategory,
  EditCategory,
  GetSalesReport,
  DeleteCategory,
  DeleteUser,
} from "../Controllers/Admin/AdminController.js";
import {
  AddProduct,
  ListProduct,
  BlockProduct,
  EditProduct,
  GetEditProduct,
  DeleteProduct,
} from "../Controllers/Admin/ProductController.js";
import {
  ListOrderDetailes,
  changeOrderStatus,
  GetTopTenProducts,
  TopCategory,
  GraphData
} from "../Controllers/Admin/OrderController.js";
import { AdminVerifyToken } from "../Middlewares/VerifyToken.js";
import {
  AddCoupon,
  getCouponList,
  BlockCoupon,
  DeleteCoupon,
  EditCoupon,
} from "../Controllers/Admin/CouponController.js";

import { AddOffer, ListOffer, BlockOffer } from "../Controllers/Admin/OfferController.js";

/*
GET
*/

adminRouter.get("/refresh-token", RefreshingToken);
adminRouter.get("/get-admin-profile", AdminVerifyToken, ListOrderDetailes);
adminRouter.get("/adminuserslist", UserList);
adminRouter.get("/admingetcategory", getCategory);
adminRouter.get("/adminlist-Products", ListProduct);
adminRouter.get("/get-edit-product", GetEditProduct);
adminRouter.get("/get-orders-list", ListOrderDetailes);
adminRouter.get("/get-coupon-list", getCouponList);
adminRouter.get("/get-offer-list", ListOffer);
adminRouter.get("/get-sales-report", GetSalesReport);
adminRouter.get("/get-top-products", GetTopTenProducts);
adminRouter.get("/get-top-category", TopCategory);
adminRouter.get('/get-graph-data', GraphData)

/*
POST
*/

adminRouter.post("/adminlogin", AdminLogin);
adminRouter.post("/adminblockuser", BlockUser);
adminRouter.post("/adminaddcategory", AddCategory);
adminRouter.post("/adminblockcategory", BlockCategory);
adminRouter.post("/adminadd-product", AddProduct);
adminRouter.post("/admin-block-product", BlockProduct);
adminRouter.post("/admin-add-coupon", AddCoupon);
adminRouter.post("/admin-block-coupon", BlockCoupon);
adminRouter.post("/admin-add-offer", AddOffer);
adminRouter.post("/admin-block-offer", BlockOffer)
adminRouter.post('/adminlogout', (req, res) => {
  res.clearCookie('adminJwt');
  res.status(200).json({ message: 'Logout successful' });
});

/*
PUT
*/

adminRouter.put("/admineditcategory", EditCategory);
adminRouter.put("/admin-edit-product", EditProduct);
adminRouter.put("/change-order-status", changeOrderStatus);
adminRouter.put("/admin-edit-coupon/:id", EditCoupon);

/*
DELETE
*/
adminRouter.delete("/admin-delete-product/:id", DeleteProduct);
adminRouter.delete("/admin-delete-category/:id", DeleteCategory);
adminRouter.delete("/admin-delete-user/:id", DeleteUser);
adminRouter.delete("/admin-delete-coupon/:id", DeleteCoupon);

export default adminRouter;
