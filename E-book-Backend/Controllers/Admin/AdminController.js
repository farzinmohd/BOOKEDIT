/*======================================== ADMIN AUTHENTICATION CONTROLLER ======================================== */

import User from "../../Models/userModel.js";
import bcrypt from "bcryptjs";
import { AccessToken, RefreshToken } from "../../Utils/Tokens.js";
const maxage = 7 * 24 * 60 * 60 * 1000;
import mongoose from "mongoose";
import Category from "../../Models/CategoryModel.js";
import Orders from '../../Models/OrderModel.js'
import jwt from "jsonwebtoken";

/*
controll referesh token
*/

const RefreshingToken = async (req, res) => {
  const refreshToken = req.cookies.adminJwt;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unatherized" });
  }
  try {
    const secret = process.env.REFRESH_TOKEN || 'your_refresh_token_secret_key_here';
    const decode = jwt.verify(refreshToken, secret);
    const admin = await User.findById(decode.userId);
    console.log("admin", admin);
    if (!admin) {
      return res.status(404).json({ message: "user not found" });
    }
    const access_token = AccessToken(admin._id);
    res.json({ access_token });
  } catch (error) {
    console.log("server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*
admin login
 */
const AdminLogin = async (req, res) => {
  const adminData = await User.findOne({ email: req.body.email });

  if (!adminData) {
    return res.status(401).json({ message: "invalid password or email" });
  }
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    adminData.password
  );
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "invalid password or email" });
  }
  if (!adminData.isActive) {
    return res.status(403).json({ message: "Sorry, you are blocked" });
  }
  console.log("adminData", adminData);
  if (adminData.role == "admin") {
    const access_token = AccessToken({ id: adminData._id, isAdmin: true }); // generate access token
    const refresh_token = RefreshToken({ id: adminData._id, isAdmin: true }); // generatew refresh token

    // send rfresh token
    res.cookie("adminJwt", refresh_token, {
      httpOnly: true,
      secure: false,
      ExpireAt: maxage,
    });
    res.status(200).json({ message: "Login successfully", access_token }); // send  access token
  } else {
    return res.status(403).json({ message: "Sorry, you are not allowed" });
  }
};

/**
 * get admin profile
 */

const adminProfile = async (req, res) => {
  try {
    const admin = await User.find({ isAdmin: true });
    if (!admin) {
      return res.status(401).json({ message: "admin not found" });
    }
    res.status(200).json({ message: "get admin profile successfully ", admin });
  } catch (error) {
    res.status(400).json({ message: "get admin profile failed " });
  }
};

/*
get users list 
*/

const UserList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const usersList = await User.find({ isAdmin: false })
      .skip(skip)
      .limit(limit);
    const totalUsers = await User.countDocuments();
    const totalPage = Math.ceil(totalUsers / limit);
    const currentPage = page;
    res.status(200).json({
      message: "get user success",
      usersList,
      totalUsers,
      totalPage,
      currentPage,
    });
  } catch (error) {
    console.log(error, "userlist");
    res.status(500).json({ message: "Failed to get users" });
  }
};

/**
 * admin block user
 */

const BlockUser = async (req, res) => {
  const { id } = req.body;

  try {
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.isActive = !user.isActive;
      await user.save();

      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ message: "Invalid or missing user ID" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
add category
*/

const AddCategory = async (req, res) => {
  const { category, description } = req.body;
  if (category.trim() === "") {
    return res.status(401).json({ message: "category cannot  be empty " });
  }
  if (description.trim() === "") {
    return res.status(401).json({ message: "description cannot be empty" });
  }
  try {
    const ExistCategory = await Category.findOne({ category });
    if (ExistCategory) {
      return res.status(404).json({ message: "This category is already" });
    }
    const newCategory = new Category({
      category,
      description,
    });
    await newCategory.save();
    await res.status(200).json({ message: "category added success" });
  } catch (error) {
    res.status(401).json({ message: "category error" });
  }
};

/*
 get category list
*/

const getCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const categoryData = await Category.find().skip(skip).limit(limit);
    const totalCategory = await Category.countDocuments();
    const totalPage = Math.ceil(totalCategory / limit);
    const currentPage = page;

    res.status(200).json({
      message: "category getting successful",
      categoryData,
      totalPage,
      currentPage,
      totalCategory,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
admin block and unblock category
*/

const BlockCategory = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "category not found" });
      }
      category.status = !category.status;
      await category.save();
      res.status(200).json({ message: "success" });
    } else {
      res.status(200).json({ message: "Invalid or missing category id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

/*
 * admin Edit category
 */

const EditCategory = async (req, res) => {
  const { category, description, id } = req.body;
  console.log(category, description, id);
  if (!category || category.trim() === "") {
    return res.status(401).json({ message: "category cannot be empty" });
  }
  if (!description || description.trim() === "") {
    return res.status(401).json({ message: "description cannot be empty" });
  }
  try {
    // const { ObjectId } = mongoose.Types;
    const ExistCategory = await Category.findOne({
      $and: [{ category }, { _id: { $ne: id } }],
    });

    // const ExistCategory = await Category.findOne({
    //   $and: [{ category }, { _id: { $ne: ObjectId(id) } }],
    // });
    if (ExistCategory) {
      return res.status(401).json({ message: "Category already exist" });
    }

    const updateCategory = await Category.findByIdAndUpdate(
      id,
      { category, description },
      { new: true }
    );
    console.log(updateCategory);
    if (!updateCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category update successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

/**
 * admin salse report
 */


// const GetSalesReport = async (req, res) => {
//   try {
//     let { sortBy, startDate, endDate } = req.query;

//     console.log(' startDate, endDate ',  startDate, endDate);
    
//     // Validate custom date inputs
//     if (startDate && isNaN(new Date(startDate))) {
//       return res.status(400).json({ message: "Invalid startDate format" });
//     }
//     if (endDate && isNaN(new Date(endDate))) {
//       return res.status(400).json({ message: "Invalid endDate format" });
//     }

//     // Initialize sort criteria
//     let filter = {}; // Use this for matching
//     switch (sortBy) {
//       case "date":
//         filter = {
//           "items.itemCreatedAt": {
//             $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
//           },
//         };
//         break;
//       case "month":
//         filter = {
//           "items.itemCreatedAt": {
//             $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           },
//         };
//         break;
//       case "year":
//         filter = {
//           "items.itemCreatedAt": {
//             $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
//           },
//         };
//         break;
//       case "customDate":
//         if (startDate && endDate) {
//           filter = {
//             "items.itemCreatedAt": {
//               $gte: new Date(startDate),
//               $lte: new Date(endDate),
//             },
//           };
//         }
//         break;
//       default:
//         filter = {};
//         break;
//     }

//     // Query the sales report
//     const salesReport = await Orders.aggregate([
//       { $unwind: "$items" },
//       { $match: filter }, // Apply the filter to match documents
//       {
//         $lookup: {
//           from: "products",
//           localField: "items.product_id",
//           foreignField: "_id",
//           as: "productDetails",
//         },
//       },
//       { $unwind: "$productDetails" },
//       { 
//         $sort: { "items.createdAt": -1 } // Apply sorting by createdAt in descending order
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "userDetails",
//         },
//       },
//       { $unwind: "$userDetails" },
//       {
//         $project: {
//           _id: 0,
//           "items.quantity": 1,
//           "items.price": 1,
//           "items.payment_id": 1,
//           "items.payment_status": 1,
//           "items.discount": 1,
//           "items.offer": 1,
//           "items.payableAmount": 1,
//           "items.itemCreatedAt": 1,
//           "items.order_status": 1,
//           "items._id": 1,
//           "productDetails._id": 1,
//           "productDetails.productName": 1,
//           "userDetails.firstName": 1,
//           "userDetails.email": 1,
//           "userDetails._id": 1,
//         },
//       },
//     ]);

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const categoryData = await Category.find().skip(skip).limit(limit);
//     const totalCategory = await Order.countDocuments();
//     const totalPage = Math.ceil(totalCategory / limit);
//     const currentPage = page;

//     res.status(200).json({
//       message: "Sales report fetched successfully",
//       salesReport,
//     });
//   } catch (error) {
//     console.error("Error fetching sales report:", error);
//     res.status(500).json({
//       message: "Sales report failed, internal server error",
//       error: error.message,
//     });
//   }
// };


const GetSalesReport = async (req, res) => {
  try {
    let { sortBy, startDate, endDate, page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    console.log("startDate, endDate", startDate, endDate);

    // Validate custom date inputs
    if (startDate && isNaN(new Date(startDate))) {
      return res.status(400).json({ message: "Invalid startDate format" });
    }
    if (endDate && isNaN(new Date(endDate))) {
      return res.status(400).json({ message: "Invalid endDate format" });
    }

    // Initialize sort criteria
    let filter = {}; // Use this for matching
    switch (sortBy) {
      case "date":
        filter = {
          "items.itemCreatedAt": {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        };
        break;
      case "month":
        filter = {
          "items.itemCreatedAt": {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      case "year":
        filter = {
          "items.itemCreatedAt": {
            $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      case "customDate":
        if (startDate && endDate) {
          filter = {
            "items.itemCreatedAt": {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          };
        }
        break;
      default:
        filter = {};
        break;
    }

    const salesReport = await Orders.aggregate([
            { $unwind: "$items" },
            { $match: filter }, // Apply the filter to match documents
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
              $sort: { "items.createdAt": -1 } // Apply sorting by createdAt in descending order
            },
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            { $unwind: "$userDetails" },
            {
              $project: {
                _id: 0,
                "items.quantity": 1,
                "items.price": 1,
                "items.payment_id": 1,
                "items.payment_status": 1,
                "items.discount": 1,
                "items.offer": 1,
                "items.payableAmount": 1,
                "items.itemCreatedAt": 1,
                "items.order_status": 1,
                "items._id": 1,
                "productDetails._id": 1,
                "productDetails.productName": 1,
                "userDetails.firstName": 1,
                "userDetails.email": 1,
                "userDetails._id": 1,
              },
            },
          ]);

    // Count total documents for pagination
    const totalDocuments = await Orders.aggregate([
      { $unwind: "$items" },
      { $match: filter },
    ]).count("count");

    const totalSalesReports = totalDocuments[0]?.count || 0;

    const salesReportPagination = await Orders.aggregate([
      { $unwind: "$items" },
      { $match: filter }, // Apply the filter to match documents
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
        $sort: { "items.createdAt": -1 }, // Apply sorting by createdAt in descending order
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          "items.quantity": 1,
          "items.price": 1,
          "items.payment_id": 1,
          "items.payment_status": 1,
          "items.discount": 1,
          "items.offer": 1,
          "items.payableAmount": 1,
          "items.itemCreatedAt": 1,
          "items.order_status": 1,
          "items._id": 1,
          "productDetails._id": 1,
          "productDetails.productName": 1,
          "userDetails.firstName": 1,
          "userDetails.email": 1,
          "userDetails._id": 1,
        },
      },
      { $skip: (page - 1) * limit }, // Skip based on current page
      { $limit: limit }, // Limit the number of results
    ]);
// --------------------
    const totalPage = Math.ceil(totalSalesReports / limit);

    res.status(200).json({
      message: "Sales report fetched successfully",
      salesReport,
      salesReportPagination,
      pagination: {
        totalSalesReports,
        totalPage,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(500).json({
      message: "Sales report failed, internal server error",
      error: error.message,
    });
  }
};

/*
 * admin delete category
 */
const DeleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/*
 * admin delete user
 */
const DeleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export {
  RefreshingToken,
  AdminLogin,
  adminProfile,
  UserList,
  BlockUser,
  AddCategory,
  getCategory,
  BlockCategory,
  EditCategory,
  GetSalesReport,
  DeleteCategory,
  DeleteUser,
};
