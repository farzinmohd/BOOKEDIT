import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { useDeleteAccountMutation } from '../../../../Services/Apis/UserApi';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Setting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await deleteAccount().unwrap();
      setIsModalOpen(false);
      // Optionally clear local storage or redux state here
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('Failed to delete account. Please try again.');
    }
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Account Settings</h2>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Typography>Language Preference</Typography>
          </CardHeader>
          <CardContent>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Typography>Time Zone</Typography>
          </CardHeader>
          <CardContent>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-6 (Central Time)</option>
              <option>UTC-7 (Mountain Time)</option>
              <option>UTC-8 (Pacific Time)</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Typography>Delete Account</Typography>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button variant="contained" color="error" halfWidth onClick={() => setIsModalOpen(true)}>
              Delete Account
            </Button>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              className="modal-content fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50"
              overlayClassName="modal-overlay fixed z-50 inset-0"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6">
                <Typography variant="h6" component="h2">
                  Are you sure you want to delete your account?
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Once deleted, you won’t be able to recover your account.
                </Typography>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setIsModalOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button color="error" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                </div>
              </div>
            </Modal>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setting;
