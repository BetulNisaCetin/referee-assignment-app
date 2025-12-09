import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend Configuration
const API_URL = "http://192.168.1.100:3000";  // ← burada http:// eksikti, düzelttim

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error reading token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);


// ------------------------------
// AUTH API
// ------------------------------
export const authAPI = {
  login: async (email, password) => {
    const res = await apiClient.post("/api/auth/login", { email, password });

    if (res.data.token) {
      await AsyncStorage.setItem("authToken", res.data.token);
    }
    return res;
  },

  register: async (userData) => {
    console.log("Register sending data:", userData);

    // userData = {name, email, password, userType, refereeType, phone, birthDate ...}
    const res = await apiClient.post("/api/auth/register", userData);

    if (res.data.token) {
      await AsyncStorage.setItem("authToken", res.data.token);
    }

    return res;
  },

  logout: async () => {
    await AsyncStorage.removeItem("authToken");
    return apiClient.post("/api/auth/logout");
  },
};


// ------------------------------
// USER API
// ------------------------------
export const userAPI = {
  getProfile: () => apiClient.get("/api/user/profile"),
  updateProfile: (userData) => apiClient.put("/api/user/profile", userData),
};


// ------------------------------
// ASSIGNMENT API
// ------------------------------
export const assignmentAPI = {
  getAssignments: () => apiClient.get("/api/assignments"),
  getAssignmentById: (id) => apiClient.get(`/api/assignments/${id}`),
  createAssignment: (data) => apiClient.post("/api/assignments", data),
  updateAssignment: (id, data) => apiClient.put(`/api/assignments/${id}`, data),
  deleteAssignment: (id) => apiClient.delete(`/api/assignments/${id}`),
};


// ------------------------------
// AVAILABILITY API
// ------------------------------
export const availabilityAPI = {
  getAvailability: () => apiClient.get("/api/availability"),
  saveAvailability: (unavailableDates) =>
    apiClient.post("/api/availability", { unavailableDates }),
};


// ------------------------------
// ADMIN API
// ------------------------------
export const adminAPI = {
  createMatch: (matchData) =>
   apiClient.post("/api/admin/create-match", matchData),
  getMatches: () => apiClient.get("/api/admin/matches"),
  getReferees: () => apiClient.get("/api/admin/referees"),
  assignReferee: (matchId, refereeId) =>
    apiClient.post("/api/admin/assign-referee", { matchId, refereeId }),
  unassignReferee: (matchId) =>
    apiClient.delete(`/api/admin/unassign-referee/${matchId}`),
};

export default apiClient;
