import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { serviceCategories } from '../lib/serviceCategories';
import { serviceLocations, stateEnum } from "../lib/serviceLocations";
import { registerService, uploadToClaudinary } from '../lib/api';
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom";

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
            const uploadedImageURL = uploadToClaudinary(file); 
            if (uploadedImageURL) {
                setServiceData(prev => ({
                    ...prev,
                    imageUrl: uploadedImageURL
                }));
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
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
                city: null
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
        <div>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="enterpriseName">Enterprise Name:</label>
                        <input
                            type="text"
                            id="enterpriseName"
                            name="enterpriseName"
                            value={serviceData.enterpriseName}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
                        />
                    </div>

                    <div>
                        <label htmlFor="category">Category:</label>
                        <select 
                            id="category" 
                            name="category" 
                            value={serviceData.category || ''} 
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
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
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={serviceData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            disabled={registerServiceMutation.isPending}
                        />
                    </div>

                    <div>
                        <label htmlFor="serviceImage">Service Image:</label>
                        <input
                            type="file"
                            id="serviceImage"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={registerServiceMutation.isPending || imageUploading}
                        />
                        {imageUploading && <p>Uploading image...</p>}
                        {serviceData.imageUrl && (
                            <div>
                                <p>Image uploaded successfully!</p>
                                <img 
                                    src={serviceData.imageUrl} 
                                    alt="Service preview" 
                                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="address">Address (excluding city and state):</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={serviceData.address}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
                        />
                    </div>

                    <div>
                        <label htmlFor="state">State:</label>
                        <select 
                            id="state" 
                            name="state" 
                            value={serviceData.state || ''} 
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
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
                        <label htmlFor="city">City:</label>
                        <select 
                            id="city" 
                            name="city" 
                            value={serviceData.city || ''} 
                            onChange={handleChange} 
                            disabled={!serviceData.state || registerServiceMutation.isPending}
                            required
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
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={serviceData.phone}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={serviceData.email}
                            onChange={handleChange}
                            required
                            disabled={registerServiceMutation.isPending}
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={registerServiceMutation.isPending || imageUploading}
                >
                    {registerServiceMutation.isPending ? 'Registering...' : 'Register Service'}
                </button>
            </form>            
        </div>
    );
};

export default CreateServicePage;