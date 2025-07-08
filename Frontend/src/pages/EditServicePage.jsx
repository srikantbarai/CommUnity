import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import Navbar from "../components/Navbar";
import { serviceLocations, stateEnum } from "../lib/serviceLocations";
import { editService, listServiceDetails, uploadToClaudinary } from '../lib/api';

const EditServicePage = () => {
  const serviceId = window.location.pathname.split('/').pop();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [imageUploading, setImageUploading] = useState(false);

  const { data: serviceDetails, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => listServiceDetails(serviceId),
  });

  const serviceData = serviceDetails?.data || {};

  const editServiceMutation = useMutation({
    mutationFn: (editData) => editService(serviceId, editData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] });
      queryClient.invalidateQueries({ queryKey: ['services'], exact: false });
      setIsEditing(false);
      setEditedData({});
      alert('Service updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.data || error.message);
    }
  });

  const currentValues = {
        enterpriseName: serviceData.enterpriseName || '',
        category: serviceData.category || '',
        description: isEditing ? (editedData.description !== undefined ? editedData.description : serviceData.description || '') : serviceData.description || '',
        address: isEditing ? (editedData.address !== undefined ? editedData.address : serviceData.address || '') : serviceData.address || '',
        city: isEditing ? (editedData.city !== undefined ? editedData.city : serviceData.location?.city || '') : serviceData.location?.city || '',
        state: isEditing ? (editedData.state !== undefined ? editedData.state : serviceData.location?.state || '') : serviceData.location?.state || '',
        phone: isEditing ? (editedData.phone !== undefined ? editedData.phone : serviceData.contact_info?.phone || '') : serviceData.contact_info?.phone || '',
        email: isEditing ? (editedData.email !== undefined ? editedData.email : serviceData.contact_info?.email || '') : serviceData.contact_info?.email || '',
        imageUrl: isEditing ? (editedData.imageUrl !== undefined ? editedData.imageUrl : serviceData.imageUrl || '') : serviceData.imageUrl || ''
    };

  const availableCities = currentValues.state ? serviceLocations[currentValues.state]?.sort() || [] : [];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2MB');
      return;
    }

    setImageUploading(true);
    try {
      const uploadedImageURL = await uploadToClaudinary(file);

      if (uploadedImageURL) {
        setEditedData(prev => ({
          ...prev,
          imageUrl: uploadedImageURL
        }));
      } else {
        throw new Error('Failed to upload image');
      }
    } catch {
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setEditedData(prev => ({
        ...prev,
        state: value,
        city: ''
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const editableData = {
      description: currentValues.description,
      address: currentValues.address,
      city: currentValues.city,
      state: currentValues.state,
      phone: currentValues.phone,
      email: currentValues.email,
      imageUrl: currentValues.imageUrl
    };
    editServiceMutation.mutate(editableData);
  };

  const handleCancel = () => {
    setEditedData({});
    setIsEditing(false);
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error loading service details</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 mt-8">
        {!isEditing ? (
          <div className="space-y-4 p-4 bg-white rounded-lg shadow">
            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">Enterprise Name:</span>
              <span className="flex-1">{currentValues.enterpriseName}</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">Category:</span>
              <span className="flex-1">{currentValues.category}</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">Description:</span>
              <span className="flex-1">{currentValues.description}</span>
            </div>

            {currentValues.imageUrl && (
              <div className="flex items-start gap-4">
                <span className="w-40 font-semibold text-gray-700">Service Image:</span>
                <img
                  src={currentValues.imageUrl}
                  alt="Service"
                  className="max-w-xs max-h-60 object-cover rounded-md shadow"
                />
              </div>
            )}

            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">Address:</span>
              <span className="flex-1">{currentValues.address}</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">State:</span>
              <span className="flex-1">{currentValues.state}</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">City:</span>
              <span className="flex-1">{currentValues.city}</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">Phone:</span>
              <span className="flex-1">{currentValues.phone}</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-40 font-semibold text-gray-700">Email:</span>
              <span className="flex-1">{currentValues.email}</span>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="enterpriseName" className="block font-semibold mb-1">
                Enterprise Name:
              </label>
              <input
                type="text"
                id="enterpriseName"
                name="enterpriseName"
                value={currentValues.enterpriseName}
                disabled
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="category" className="block font-semibold mb-1">
                Category:
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={currentValues.category}
                disabled
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-semibold mb-1">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={currentValues.description}
                onChange={handleChange}
                rows="4"
                required
                disabled={editServiceMutation.isPending}
                className="w-full border border-gray-300 rounded-md p-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="serviceImage" className="block font-semibold mb-1">
                Service Image:
              </label>
              <div
                className="border-2 border-dashed border-indigo-400 rounded-md p-4 cursor-pointer hover:bg-indigo-50 transition"
                onClick={() => document.getElementById('serviceImage').click()}
              >
                <input
                  type="file"
                  id="serviceImage"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={editServiceMutation.isPending || imageUploading}
                  className="hidden"
                />
                {currentValues.imageUrl ? (
                  <img
                    src={currentValues.imageUrl}
                    alt="Service preview"
                    className="max-w-xs max-h-52 object-cover rounded-md mx-auto"
                  />
                ) : (
                  <p className="text-indigo-600 text-center">Click or drag file to upload</p>
                )}
              </div>
              {imageUploading && <p className="text-indigo-600 mt-2">Uploading image...</p>}
            </div>

            <div>
              <label htmlFor="address" className="block font-semibold mb-1">
                Address (excluding city and state):
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={currentValues.address}
                onChange={handleChange}
                required
                disabled={editServiceMutation.isPending}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="state" className="block font-semibold mb-1">
                State:
              </label>
              <select
                id="state"
                name="state"
                value={currentValues.state || ''}
                onChange={handleChange}
                required
                disabled={editServiceMutation.isPending}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select State</option>
                {stateEnum.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block font-semibold mb-1">
                City:
              </label>
              <select
                id="city"
                name="city"
                value={currentValues.city || ''}
                onChange={handleChange}
                disabled={!currentValues.state || editServiceMutation.isPending}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              >
                <option value="">Select City</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block font-semibold mb-1">
                Phone:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={currentValues.phone}
                onChange={handleChange}
                required
                disabled={editServiceMutation.isPending}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-semibold mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={currentValues.email}
                onChange={handleChange}
                required
                disabled={editServiceMutation.isPending}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={editServiceMutation.isPending || imageUploading}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {editServiceMutation.isPending ? 'Saving...' : 'Save'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={editServiceMutation.isPending || imageUploading}
                className="flex-1 border border-gray-300 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditServicePage;
