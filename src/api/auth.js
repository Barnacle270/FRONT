import axios from "./axios";

export const registerRequest = (user) => axios.post(`/v2/register`, user);

export const loginRequest = (user) => axios.post(`/v2/login`, user);

export const verifyTokenRequest = () => axios.get(`/v2/verify`);

export const getProfileRequest = () => axios.get(`/v2/profile`);

