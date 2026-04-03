import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-attach token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (username, password) =>
  api.post("/api/login", { username, password });

// Tasks
export const getTasks = (filters = {}) =>
  api.get("/api/tasks", { params: filters });

export const createTask = (task) => api.post("/api/tasks", task);

export const updateTask = (id, task) => api.put(`/api/tasks/${id}`, task);

export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export default api;