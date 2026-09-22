import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL ?? "http://localhost:5000/api",
});

export default apiClient;
