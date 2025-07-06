import { axiosInstance } from "./axios.js";

export const signup = async (signupData) => {
    const res = await axiosInstance.post("/auth/signup", signupData);
    return res.data;
}

export const login = async (loginData) => {
    const res = await axiosInstance.post("/auth/login", loginData);
    return res.data;
}

export const logout = async () => {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
}

export const getMyInfo = async () => {
    const res = await axiosInstance.get("/user/me");
    return res.data;
}

export const updateMyInfo = async (updateMyInfoData) => {
    const res = await axiosInstance.patch("/user/me",updateMyInfoData);
    return res.data;
}

export const listServices = async (filters) => {
    const res = await axiosInstance.get("/services",{
        params: filters
    });
    return res.data;
}

export const registerService = async (registerServiceData) => {
    const res = await axiosInstance.post("/services",registerServiceData);
    return res.data;
}

export const listServiceDetails = async (serviceId) => {
    const res = await axiosInstance.get(`/services/${serviceId}`);
    return res.data;
}

export const editService = async (serviceId,editServiceData) => {
    const res = await axiosInstance.patch(`/services/${serviceId}`,editServiceData);
    return res.data;
}

export const deleteService = async (serviceId, password) => {
    const res = await axiosInstance.delete(`/services/${serviceId}`, {
        headers: {
            'X-User-Password': password
        }
    });
    return res.data;
}

export const getAllReviewsForService = async (serviceId) => {
    const res = await axiosInstance.get(`/services/${serviceId}/reviews`);
    return res.data;
}

export const createReviewForService = async (serviceId,createReviewForServiceData) => {
    const res = await axiosInstance.post(`/services/${serviceId}/reviews`,createReviewForServiceData);
    return res.data;
}

export const deleteReviewForService = async (serviceId,reviewId) => {
    const res = await axiosInstance.delete(`/services/${serviceId}/reviews/${reviewId}`);
    return res.data;
}

export const uploadToClaudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "CommUnity");
    data.append("cloud_name", "dhgflpbge");
    const res = await fetch("https://api.cloudinary.com/v1_1/dhgflpbge/image/upload", {
        method: "POST",
        body: data
    });
    return await res.json().url;
}