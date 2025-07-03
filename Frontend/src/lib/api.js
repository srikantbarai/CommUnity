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

export const getUserInfo = async (userId) => {
    const res = await axiosInstance.get(`/user/${userId}`);
    return res.data;
}

export const listServices = async () => {
    const res = await axiosInstance.get("/services");
    return res.data;
}

export const registerService = async (registerServiceData) => {
    const res = await axiosInstance.post("/services");
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

export const deleteService = async (serviceId,deleteServiceData) => {
    const res = await axiosInstance.get(`/services/${serviceId}`,deleteServiceData);
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

export const editReviewForService = async (serviceId,reviewId,editReviewForServiceData) => {
    const res = await axiosInstance.patch(`/services/${serviceId}/reviews/${reviewId}`,editReviewForServiceData);
    return res.data;
}

export const deleteReviewForService = async (serviceId,reviewId) => {
    const res = await axiosInstance.delete(`/services/${serviceId}/reviews/${reviewId}`);
    return res.data;
}