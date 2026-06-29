import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Admin pages call admin-protected endpoints and customer pages call
// customer-protected endpoints, so we pick the right token based on
// which area of the site is currently active.
api.interceptors.request.use((config) => {
  const isAdminPath = window.location.pathname.startsWith("/admin");
  const token = isAdminPath
    ? localStorage.getItem("bouqhai_admin_token")
    : localStorage.getItem("bouqhai_user_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;