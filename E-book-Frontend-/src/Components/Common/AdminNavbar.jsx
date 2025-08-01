import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle, FaCog, FaSignOutAlt, FaBars, FaTimes, FaBook } from "react-icons/fa";
import Modal from 'react-modal';
import { Button, Typography } from '@mui/material';

const AdminNavbar = ({ sidebarOpen, toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
    window.location.reload();
  };

  return (
    <header className="bg-white border-b ">
      <div className="flex items-center justify-between px-6 py-4 ">
        <div className="flex items-center gap-6">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h3
        className="flex items-center justify-center mt-"
        style={{ fontSize: "20px", fontWeight: "bold" }}
      >
    <FaBook className="ml-4 text-black" /> <span>Bookify (Admin)</span>
</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl text-black" />
            <span className="text-black">Admin</span>
          </button>
          {/* dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
              <button
                onClick={() => navigate('/profile')}
                className="w-full px-4 py-2 hover:bg-gray-200 flex items-center space-x-2"
              >
                <FaCog /> <span>Settings</span>
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full px-4 py-2 text-red-600 hover:bg-gray-200 flex items-center space-x-2"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        {/* Logout Confirmation Modal */}
        <Modal
          isOpen={isLogoutModalOpen}
          onRequestClose={() => setIsLogoutModalOpen(false)}
          className="modal-content fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50"
          overlayClassName="modal-overlay fixed z-50 inset-0"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6">
            <Typography variant="h6" component="h2">
              Are you sure you want to logout?
            </Typography>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setIsLogoutModalOpen(false)} color="primary">
                Cancel
              </Button>
              <Button color="error" onClick={() => { setIsLogoutModalOpen(false); handleLogout(); }}>
                Yes, Logout
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </header>
  );
};

export default AdminNavbar;
