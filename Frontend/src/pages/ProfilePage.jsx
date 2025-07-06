import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {Eye, EyeOff} from "lucide-react"
import useGetMyInfo from "../hooks/useGetMyInfo"
import Navbar from "../components/Navbar"
import { listServices, deleteService, updateMyInfo } from "../lib/api"
import { useNavigate } from "react-router-dom"

const ProfilePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {myInfo} = useGetMyInfo();
    const [deletePassword, setDeletePassword] = useState("");
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [eyeOnEdit,setEyeOnEdit] = useState(false);
    const [eyeOnPrompt,setEyeOnPrompt] = useState(false);
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
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "CommUnity");
            data.append("cloud_name", "dhgflpbge");
            
            const res = await fetch("https://api.cloudinary.com/v1_1/dhgflpbge/image/upload", {
                method: "POST",
                body: data
            });
            
            const uploadedImageURL = await res.json();
            if (uploadedImageURL.url) {
                handleUserInfoChange('profilePicUrl', uploadedImageURL.url);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
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
        setEditedUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div>
            <Navbar />
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", position: "relative" }}>
                <button
                    onClick={handleUserEditToggle}
                    style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        backgroundColor: userEditMode ? "#28a745" : "#007bff",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                    }}
                    disabled={updateUserInfoMutation.isLoading || imageUploading}
                >
                    {updateUserInfoMutation.isLoading ? "Saving..." : userEditMode ? "Save" : "Edit"}
                </button>
                <div>
                    <div>
                        <img
                            src={(editedUserInfo.profilePicUrl || myInfo.profilePicUrl) ? 
                                (userEditMode ? editedUserInfo.profilePicUrl : myInfo.profilePicUrl) : 
                                "/user.webp"}
                            alt="Profile"
                            width="60"
                            height="60"
                            style={{ borderRadius: "50%", marginRight: "10px" }}
                        />
                        {userEditMode && (
                            <div style={{ marginTop: "10px" }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e.target.files[0])}
                                    style={{
                                        marginRight: "10px",
                                        padding: "2px 5px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px"
                                    }}
                                    disabled={imageUploading}
                                />
                                <button 
                                    type="button"
                                    onClick={() => handleUserInfoChange('profilePicUrl', '')}
                                    style={{
                                        padding: "2px 8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px",
                                        backgroundColor: "#f8f9fa",
                                        cursor: "pointer"
                                    }}
                                    disabled={imageUploading}
                                >
                                    Remove Image
                                </button>
                                {imageUploading && (
                                    <span style={{ marginLeft: "10px", color: "#007bff" }}>
                                        Uploading...
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        Full Name: {userEditMode ? (
                            <input
                                type="text"
                                value={editedUserInfo.fullName}
                                onChange={(e) => handleUserInfoChange('fullName', e.target.value)}
                                style={{
                                    marginLeft: "5px",
                                    padding: "2px 5px",
                                    border: "1px solid #ccc",
                                    borderRadius: "3px"
                                }}
                            />
                        ) : (
                            myInfo.fullName
                        )}
                    </div>
                    <div>
                        EmailId: {myInfo.email}
                    </div>
                    <div>
                        Password: {userEditMode ? (
                            <>
                                <input
                                    type={eyeOnEdit ? "text" : "password"} 
                                    value={editedUserInfo.password}
                                    onChange={(e) => handleUserInfoChange('password', e.target.value)}
                                    style={{
                                        marginLeft: "5px",
                                        padding: "2px 5px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px"
                                    }}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle"
                                    onClick={() => setEyeOnEdit(!eyeOnEdit)}
                                    aria-label={eyeOnEdit ? "Hide password" : "Show password"}
                                >
                                    {eyeOnEdit ? <EyeOff/> : <Eye/>}
                                </button>
                            </>
                        ) : (
                            "••••••••"
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h2>Manage your Services:</h2>
                
                {myServicesLoading && <p>Loading your services...</p>}
                {myServicesError && <p>Error loading services: {myServicesError.response?.data?.data || myServicesError.message}</p>}
                
                {myServicesData && myServicesData.length > 0 ? (
                    <div>
                        {myServicesData.map((serviceData, index) => (
                            <div key={serviceData._id || index} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", position: "relative" }}>
                                <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                                    <button
                                        onClick={() => navigate(`/services/${serviceData._id}`)}
                                        style={{
                                            backgroundColor: "#17a2b8",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "12px"
                                        }}
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/edit-service/${serviceData._id}`)}
                                        style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "12px"
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(serviceData)}
                                        style={{
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "12px"
                                        }}
                                        disabled={deleteServiceMutation.isLoading}
                                    >
                                        {deleteServiceMutation.isLoading && serviceToDelete?._id === serviceData._id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                                
                                <img
                                    src={serviceData.imageUrl}
                                    alt="Enterprise"
                                    width="50"
                                    height="50"
                                    style={{ marginRight: "10px" }}
                                />
                                
                                <h1>{serviceData.enterpriseName}</h1>
                                <p>Category: {serviceData.category}</p>
                                <p>{serviceData.description}</p>
                                <p>Address: {serviceData.address}, {serviceData.location.city}, {serviceData.location.state}</p>
                                <p>Phone: {serviceData.contact_info.phone}</p>
                                <p>Email: {serviceData.contact_info.email}</p>
                                <p>Rating: {serviceData.averageRating} ⭐</p>
                                <p>Total Reviews: {serviceData.reviewCount}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    !myServicesLoading && <p>No services found.</p>
                )}
            </div>

            {showPasswordPrompt && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "400px",
                        maxWidth: "90%"
                    }}>
                        <h3>Confirm Service Deletion</h3>
                        <p>Are you sure you want to delete "{serviceToDelete?.enterpriseName}"?</p>
                        <p>Enter your account password to confirm:</p>
                        <input
                            type={eyeOnPrompt ? "text" : "password"} 
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginBottom: "15px",
                                border: "1px solid #ccc",
                                borderRadius: "4px"
                            }}
                        />
                        <button 
                            type="button" 
                            className="password-toggle"
                            onClick={() => setEyeOnPrompt(!eyeOnPrompt)}
                            aria-label={eyeOnPrompt ? "Hide password" : "Show password"}
                            >
                            {eyeOnPrompt ? <EyeOff/> : <Eye/>}
                        </button>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                onClick={handleDeleteCancel}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                                disabled={deleteServiceMutation.isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                                disabled={deleteServiceMutation.isLoading}
                            >
                                {deleteServiceMutation.isLoading ? "Deleting..." : "Delete Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage