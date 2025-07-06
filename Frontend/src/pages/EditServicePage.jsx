import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { serviceLocations, stateEnum } from "../lib/serviceLocations";
import { editService, listServiceDetails, uploadToClaudinary } from '../lib/api';
import Navbar from "../components/Navbar"

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
        onSuccess: (data) => {
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

        if (file.size > 2*1024*1024) {
            alert('Please select an image smaller than 2MB');
            return;
        }
        setImageUploading(true);
        try {
            const uploadedImageURL = uploadToClaudinary(file)
            
            if (uploadedImageURL) {
                setEditedData(prev => ({
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

    const handleSubmit = async (e) => {
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading service details</div>;
    
    return (
        <div>
            <Navbar />
            {!isEditing ? (
                <div>
                    <div>
                        <label>Enterprise Name:</label>
                        <p>{currentValues.enterpriseName}</p>
                    </div>

                    <div>
                        <label>Category:</label>
                        <p>{currentValues.category}</p>
                    </div>

                    <div>
                        <label>Description:</label>
                        <p>{currentValues.description}</p>
                    </div>

                    {currentValues.imageUrl && (
                        <div>
                            <label>Service Image:</label>
                            <div>
                                <img 
                                    src={currentValues.imageUrl} 
                                    alt="Service" 
                                    style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label>Address (excluding city and state):</label>
                        <p>{currentValues.address}</p>
                    </div>

                    <div>
                        <label>State:</label>
                        <p>{currentValues.state}</p>
                    </div>

                    <div>
                        <label>City:</label>
                        <p>{currentValues.city}</p>
                    </div>

                    <div>
                        <label>Phone:</label>
                        <p>{currentValues.phone}</p>
                    </div>

                    <div>
                        <label>Email:</label>
                        <p>{currentValues.email}</p>
                    </div>
                    
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <label htmlFor="enterpriseName">Enterprise Name:</label>
                            <input
                                type="text"
                                id="enterpriseName"
                                name="enterpriseName"
                                value={currentValues.enterpriseName}
                                disabled={true}
                            />
                        </div>

                        <div>
                            <label htmlFor="category">Category:</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={currentValues.category}
                                disabled={true}
                            />
                        </div>

                        <div>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={currentValues.description}
                                onChange={handleChange}
                                rows="4"
                                required
                                disabled={editServiceMutation.isPending}
                            />
                        </div>

                        <div>
                            <label htmlFor="serviceImage">Service Image:</label>
                            <input
                                type="file"
                                id="serviceImage"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={editServiceMutation.isPending || imageUploading}
                            />
                            {imageUploading && <p>Uploading image...</p>}
                            {currentValues.imageUrl && (
                                <div>
                                    <p>Current image:</p>
                                    <img 
                                        src={currentValues.imageUrl} 
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
                                value={currentValues.address}
                                onChange={handleChange}
                                required
                                disabled={editServiceMutation.isPending}
                            />
                        </div>

                        <div>
                            <label htmlFor="state">State:</label>
                            <select 
                                id="state" 
                                name="state" 
                                value={currentValues.state || ''} 
                                onChange={handleChange}
                                required
                                disabled={editServiceMutation.isPending}
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
                                value={currentValues.city || ''} 
                                onChange={handleChange} 
                                disabled={!currentValues.state || editServiceMutation.isPending}
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
                                value={currentValues.phone}
                                onChange={handleChange}
                                required
                                disabled={editServiceMutation.isPending}
                            />
                        </div>

                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={currentValues.email}
                                onChange={handleChange}
                                required
                                disabled={editServiceMutation.isPending}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <button 
                            type="submit" 
                            disabled={editServiceMutation.isPending || imageUploading}
                        >
                            {editServiceMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            disabled={editServiceMutation.isPending || imageUploading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}          
        </div>
    )
}

export default EditServicePage;