import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Star } from "lucide-react";

import useGetMyInfo from "../hooks/useGetMyInfo";
import Navbar from "../components/Navbar";
import { listServices, deleteService, updateMyInfo, uploadToClaudinary } from "../lib/api";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { myInfo } = useGetMyInfo();
  const [deletePassword, setDeletePassword] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [eyeOnEdit, setEyeOnEdit] = useState(false);
  const [eyeOnPrompt, setEyeOnPrompt] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [userEditMode, setUserEditMode] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({
    fullName: myInfo.fullName || '',
    password: myInfo.password || '',
    profilePicUrl: myInfo.profilePicUrl || ''
  });

  const updateUserInfoMutation = useMutation({
    mutationFn: (updateData) => updateMyInfo(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(['myInfo']);
      setUserEditMode(false);
      alert("User info updated successfully!");
    },
    onError: (error) => {
      alert(`Error updating user info: ${error.response?.data?.data || error.message}`);
    }
  });

  const { data: myServicesData, isLoading: myServicesLoading, error: myServicesError } = useQuery({
    queryKey: ['myServices'],
    queryFn: () => listServices({ userServices: true }),
    select: (data) => data.data
  });

  const deleteServiceMutation = useMutation({
    mutationFn: ({ serviceId, password }) => deleteService(serviceId, password),
    onSuccess: () => {
      queryClient.invalidateQueries(['myServices']);
      setShowPasswordPrompt(false);
      setDeletePassword("");
      setServiceToDelete(null);
      alert("Service deleted successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data?.data || error.message}`);
    }
  });

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const uploadedImageURL = await uploadToClaudinary(file);
      if (uploadedImageURL) {
        handleUserInfoChange('profilePicUrl', uploadedImageURL);
      }
    } catch (error) {
      alert("Error uploading image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowPasswordPrompt(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletePassword.trim()) {
      alert("Please enter your password");
      return;
    }
    deleteServiceMutation.mutate({
      serviceId: serviceToDelete._id,
      password: deletePassword
    });
  };

  const handleDeleteCancel = () => {
    setShowPasswordPrompt(false);
    setDeletePassword("");
    setServiceToDelete(null);
  };

  const handleUserEditToggle = () => {
    if (userEditMode) {
      const updateData = {
        fullName: editedUserInfo.fullName.trim(),
        password: editedUserInfo.password.trim(),
        profilePicUrl: editedUserInfo.profilePicUrl
      };
      updateUserInfoMutation.mutate(updateData);
    } else {
      setEditedUserInfo({
        fullName: myInfo.fullName || '',
        password: myInfo.password || '',
        profilePicUrl: myInfo.profilePicUrl || ''
      });
    }
    setUserEditMode(!userEditMode);
  };

  const handleUserInfoChange = (field, value) => {
    setEditedUserInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <Navbar />

      <div className="relative p-6 mx-auto my-8 max-w-4xl border border-gray-300 rounded-lg flex gap-6 items-center">
        <button
            onClick={handleUserEditToggle}
            className={`absolute top-4 right-4 px-3 py-1 text-sm rounded text-white transition-colors cursor-pointer ${
            userEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={updateUserInfoMutation.isLoading || imageUploading}
        >
            {updateUserInfoMutation.isLoading ? "Saving..." : userEditMode ? "Save" : "Edit"}
        </button>

        <div
            onClick={() => userEditMode && document.getElementById('profilePicInput').click()}
            className={`w-16 h-16 rounded-full border-2 border-dashed border-indigo-500 cursor-pointer relative overflow-hidden flex items-center justify-center ${
            userEditMode ? 'hover:bg-indigo-50' : ''
            }`}
            title={userEditMode ? "Click to change profile picture" : ""}
        >
            {imageUploading ? (
            <p className="text-indigo-600 animate-pulse text-xs">Uploading...</p>
            ) : (
            <img
                src={editedUserInfo.profilePicUrl || myInfo.profilePicUrl || "/user.webp"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
            />
            )}
            {userEditMode && (
            <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-full text-white text-xs select-none">
                Change
            </div>
            )}
            <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            disabled={imageUploading}
            className="hidden"
            />
        </div>

        {userEditMode && editedUserInfo.profilePicUrl && (
            <button
            type="button"
            onClick={() => handleUserInfoChange('profilePicUrl', '')}
            disabled={imageUploading}
            className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
            >
            Remove Image
            </button>
        )}

        <div className="flex flex-col gap-4 flex-grow">
            <div className="flex items-center gap-2 min-w-[280px]">
            <span className="font-semibold min-w-[90px]">Full Name:</span>
            {userEditMode ? (
                <input
                type="text"
                value={editedUserInfo.fullName}
                onChange={(e) => handleUserInfoChange('fullName', e.target.value)}
                className="flex-grow max-w-[300px] px-2 py-1 border rounded"
                />
            ) : (
                <span className="inline-block max-w-[300px] truncate">{myInfo.fullName}</span>
            )}
            </div>

            <div className="flex items-center gap-2 min-w-[280px]">
            <span className="font-semibold min-w-[90px]">Email:</span>
            <span className="inline-block max-w-[300px] truncate">{myInfo.email}</span>
            </div>

            <div className="flex items-center gap-2 min-w-[280px]">
            <span className="font-semibold min-w-[90px]">Password:</span>
            {userEditMode ? (
                <>
                <input
                    type={eyeOnEdit ? "text" : "password"}
                    value={editedUserInfo.password}
                    onChange={(e) => handleUserInfoChange('password', e.target.value)}
                    className="flex-grow max-w-[300px] px-2 py-1 border rounded"
                />
                <button
                    type="button"
                    onClick={() => setEyeOnEdit(!eyeOnEdit)}
                    className="ml-2 p-1 text-gray-600 hover:text-gray-900 transition cursor-pointer"
                    aria-label={eyeOnEdit ? "Hide password" : "Show password"}
                >
                    {eyeOnEdit ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </>
            ) : (
                <span className="inline-block max-w-[300px] truncate">••••••••</span>
            )}
            </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold mb-4">Manage your Services:</h2>

        {myServicesLoading && <p>Loading your services...</p>}
        {myServicesError && (
            <p className="text-red-500">
            {myServicesError.response?.data?.data || myServicesError.message}
            </p>
        )}

        {myServicesData?.length > 0 ? (
            <div className="space-y-4">
            {myServicesData.map((service) => (
                <div
                key={service._id}
                className="p-4 border rounded-md shadow relative hover:bg-gray-50 transition flex gap-4 justify-between"
                >
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col items-center justify-center gap-2 min-w-[80px]">
                    <img
                        src={service.imageUrl}
                        alt="Service"
                        className="w-30 h-30 object-cover rounded"
                    />
                    <h3 className="text-md font-semibold text-center">{service.enterpriseName}</h3>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <div>
                        <span className="font-medium text-gray-800">Category:</span>{" "}
                        {service.category}
                      </div>
                      <div>{service.description}</div>
                      <div>
                        {service.address}, {service.location.city}, {service.location.state}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Phone:</span>{" "}
                        {service.contact_info.phone}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Email:</span>{" "}
                        {service.contact_info.email}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 mr-1">Rating:</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              fill={star <= service.averageRating ? "#facc15" : "none"}
                              stroke={star <= service.averageRating ? "#facc15" : "#cbd5e1"}
                              className="mr-0.5"
                            />
                          ))}
                          <span className="text-sm font-medium ml-2 text-slate-600">
                            {service.averageRating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-800">Total Reviews:</span>{" "}
                        {service.reviewCount}
                      </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-2">
                    <button
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="bg-cyan-600 text-white px-4 py-2 w-20 rounded hover:bg-cyan-700 cursor-pointer"
                    >
                    View
                    </button>
                    <button
                    onClick={() => navigate(`/edit-service/${service._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 w-20 rounded hover:bg-blue-700 cursor-pointer"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDeleteClick(service)}
                    className="bg-red-600 text-white px-4 py-2 w-20 rounded hover:bg-red-700 cursor-pointer"
                    disabled={deleteServiceMutation.isLoading}
                    >
                    {deleteServiceMutation.isLoading &&
                    serviceToDelete?._id === service._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                </div>
                </div>
            ))}
            </div>
        ) : (
            !myServicesLoading && <p>No services found.</p>
        )}
      </div>
      {showPasswordPrompt && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Confirm Service Deletion</h3>
        <p className="mb-1">Are you sure you want to delete "{serviceToDelete?.enterpriseName}"?</p>
        <p className="mb-3">Enter your account password to confirm:</p>
        <div className="flex items-center gap-2 mb-4">
            <input
            type={eyeOnPrompt ? "text" : "password"}
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your password"
            />
            <button type="button" onClick={() => setEyeOnPrompt(!eyeOnPrompt)} className="cursor-pointer">
            {eyeOnPrompt ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
        <div className="flex justify-end gap-2">
            <button
            onClick={handleDeleteCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
            >
            Cancel
            </button>
            <button
            onClick={handleDeleteConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
            disabled={deleteServiceMutation.isLoading}
            >
            {deleteServiceMutation.isLoading ? "Deleting..." : "Delete Service"}
            </button>
        </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ProfilePage;
