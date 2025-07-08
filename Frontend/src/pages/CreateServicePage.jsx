import React, { useState } from "react";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar"
import { serviceCategories } from '../lib/serviceCategories';
import { serviceLocations, stateEnum } from "../lib/serviceLocations";
import { registerService, uploadToClaudinary } from '../lib/api';

const CreateServicePage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient();
    const [serviceData, setServiceData] = useState({
        enterpriseName: '',
        category: '',
        description: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        email: '',
        imageUrl: ''
    });
    const [imageUploading, setImageUploading] = useState(false);

    const registerServiceMutation = useMutation({
        mutationFn: registerService,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['services'], exact: false });
            setServiceData({
                enterpriseName: '',
                category: '',
                description: '',
                address: '',
                city: '',
                state: '',
                phone: '',
                email: '',
                imageUrl: ''
            });
            alert('Service registered successfully!');
            navigate('/')
        },
        onError: (error) => {
            alert(error.response?.data?.data || error.message);
        }
    });

    const availableCities = serviceData.state ? serviceLocations[serviceData.state].sort() : [];

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        if (file.size > 2*1024*1024) {
            alert('Please select an image smaller than 2MB');
            return;
        }
        setImageUploading(true);
        try {
            const uploadedImageURL = await uploadToClaudinary(file);
            if (uploadedImageURL) {
                setServiceData(prev => ({
                    ...prev,
                    imageUrl: uploadedImageURL
                }));
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            alert('Failed to upload image. Please try again.');
        } finally {
            setImageUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'state') {
            setServiceData(prev => ({
                ...prev,
                state: value,
                city: ''
            }));
        } else {
            setServiceData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        registerServiceMutation.mutate(serviceData);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <form 
              onSubmit={handleSubmit} 
              className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md mt-8"
            >
                <div className="space-y-6">
                    <div>
                        <label htmlFor="enterpriseName" className="block font-semibold mb-1">
                          Enterprise Name:
                        </label>
                        <input
                            type="text"
                            id="enterpriseName"
                            name="enterpriseName"
                            value={serviceData.enterpriseName}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block font-semibold mb-1">
                          Category:
                        </label>
                        <select 
                            id="category" 
                            name="category" 
                            value={serviceData.category || ''} 
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="">Select Category</option>
                            {serviceCategories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block font-semibold mb-1">
                          Description:
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={serviceData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            disabled={registerServiceMutation.isPending}
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
                            disabled={registerServiceMutation.isPending || imageUploading}
                            className="hidden"
                            />
                            {serviceData.imageUrl ? (
                            <img
                                src={serviceData.imageUrl}
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
                            value={serviceData.address}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
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
                            value={serviceData.state || ''} 
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
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
                            value={serviceData.city || ''} 
                            onChange={handleChange} 
                            disabled={!serviceData.state || registerServiceMutation.isPending}
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
                            value={serviceData.phone}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
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
                            value={serviceData.email}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={registerServiceMutation.isPending || imageUploading}
                    className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {registerServiceMutation.isPending ? 'Registering...' : 'Register Service'}
                </button>
            </form>            
        </div>
    );
};

export default CreateServicePage;
