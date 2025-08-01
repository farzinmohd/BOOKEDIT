import React, { useState } from "react";
import {
  FaSearch,
  FaBell,
  FaFileExport,
  FaFileImport,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery,useBlockProductMutation, useDeleteProductMutation } from "../../../../Services/Apis/AdminApi";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [blockProduct]= useBlockProductMutation()
  const [deleteProduct] = useDeleteProductMutation();
  const [activeTab, setActiveTab] = useState("products");
  const [currentPage, setCurrentPage] = useState(1);

  // Add searchQuery state
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    page: currentPage,
    limit: 10,
  });

  
  const handleAddProduct = () => {
    navigate("/admin/addproduct");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products. Please try again later.</p>;
  }

  const { products, totalPage } = data;
console.log(totalPage);

  /**
   * admin block & unblock product
   */

  const handleBlockProduct = async (id) =>{
    try {
      await blockProduct({id})
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * handle delete product
   */
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (error) {
        alert('Failed to delete product.');
      }
    }
  };

  /**
   * navigate edit page
   */
  const handleNavigateEditPage = (product_id)=>{
    navigate(`/admin/editProduct/${product_id}`)
  }

  // Filter products by searchQuery
  const filteredProducts = data?.products?.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button
            className={`pb-4 px-2 ${
              activeTab === "products"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          {/* <button
            className={`pb-4 px-2 ${
              activeTab === "categories"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button> */}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Products</h2>
          <div className="flex gap-3">
            <div className="relative">
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
            <button
              onClick={handleAddProduct}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add new product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6">No</th>
                <th className="text-left py-4 px-6">Image</th>
                <th className="text-left py-4 px-6">Product name</th>
                <th className="text-left py-4 px-6">Author</th>
                <th className="text-left py-4 px-6">Category</th>
                <th className="text-left py-4 px-6">Price</th>
                <th className="text-left py-4 px-6">Stock</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="py-4 px-6">
                    <img
                      className="w-10 h-10 object-cover rounded"
                      src={`${product.images[0]}`}
                      alt=""
                    />
                  </td>
                  <td className="py-4 px-6">{product.productName}</td>
                  <td className="py-4 px-6">{product.author}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">{product.price}</td>
                  <td className="py-4 px-6">{product.stock}</td>
                  <td className="py-4 px-6">
                    <button onClick={()=> handleBlockProduct(product._id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status ? "Active" : "Block"}
                    </button>
                  </td>
                  <td className="py-4 px-8">
                    <div className="flex gap-2">
                      <button onClick={()=> handleNavigateEditPage(product._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <FaTrashAlt className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
        
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 mx-1 border rounded ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default AdminProducts;
