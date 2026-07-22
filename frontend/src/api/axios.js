import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("melixer_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      localStorage.removeItem("melixer_token");
      localStorage.removeItem("melixer_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
