import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { useEditCouponMutation } from "../../../../Services/Apis/AdminApi";

const validationSchema = Yup.object().shape({
  couponName: Yup.string()
    .max(20, "Coupon name cannot exceed 20 characters")
    .required("Coupon name is required"),
  couponCode: Yup.string()
    .max(20, "Coupon code cannot exceed 20 characters")
    .required("Coupon code is required"),
  startDate: Yup.date().required("Start date is required"),
  minimumAmount: Yup.number()
    .positive("Minimum amount must be greater than zero")
    .required("Minimum amount is required"),
  expireDate: Yup.date()
    .min(Yup.ref("startDate"), "Expire date must be after the start date")
    .required("Expire date is required"),
  offer: Yup.number()
    .positive("Offer amount must be greater than zero")
    .required("Offer amount is required"),
  description: Yup.string()
    .max(100, "Description cannot exceed 100 characters")
    .required("Description is required"),
});

const AdminEditCoupons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [EditCoupon] = useEditCouponMutation();
  const [couponData, setCouponData] = useState(null);

  useEffect(() => {
    if (location.state?.couponData) {
      setCouponData(location.state.couponData);
    } else {
      navigate("/admin/coupons");
    }
  }, [location.state, navigate]);

  const formik = useFormik({
    initialValues: {
      couponName: couponData?.couponName || "",
      couponCode: couponData?.couponCode || "",
      startDate: couponData?.startDate ? new Date(couponData.startDate).toISOString().split('T')[0] : "",
      minimumAmount: couponData?.minimumAmount || "",
      expireDate: couponData?.expireDate ? new Date(couponData.expireDate).toISOString().split('T')[0] : "",
      offer: couponData?.offer || "",
      description: couponData?.description || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await EditCoupon({
          id: couponData._id,
          ...values,
        });
        if (response.data) {
          alert("Coupon updated successfully!");
          navigate("/admin/coupons");
        }
      } catch (error) {
        alert("Failed to update coupon.");
      }
    },
  });

  if (!couponData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">EDIT - COUPONS</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Coupon Name</label>
            <input
              type="text"
              name="couponName"
              value={formik.values.couponName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Coupon Name"
            />
            {formik.touched.couponName && formik.errors.couponName && (
              <div className="text-red-600 text-sm">{formik.errors.couponName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Coupon Code</label>
            <input
              type="text"
              name="couponCode"
              value={formik.values.couponCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Coupon Code"
            />
            {formik.touched.couponCode && formik.errors.couponCode && (
              <div className="text-red-600 text-sm">{formik.errors.couponCode}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-600 text-sm">{formik.errors.startDate}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Minimum Amount</label>
            <input
              type="number"
              name="minimumAmount"
              value={formik.values.minimumAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Minimum Amount"
            />
            {formik.touched.minimumAmount && formik.errors.minimumAmount && (
              <div className="text-red-600 text-sm">{formik.errors.minimumAmount}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expire Date</label>
            <input
              type="date"
              name="expireDate"
              value={formik.values.expireDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formik.touched.expireDate && formik.errors.expireDate && (
              <div className="text-red-600 text-sm">{formik.errors.expireDate}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Offer (%)</label>
            <input
              type="number"
              name="offer"
              value={formik.values.offer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Offer Percentage"
            />
            {formik.touched.offer && formik.errors.offer && (
              <div className="text-red-600 text-sm">{formik.errors.offer}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Description"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-600 text-sm">{formik.errors.description}</div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Update Coupon
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/coupons")}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCoupons; 