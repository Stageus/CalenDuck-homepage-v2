import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.REACT_APP_API_KEY,
});

export default axiosInstance;
