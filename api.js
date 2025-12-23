import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_URL = "http://localhost:8090";  


const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


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


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const res = await apiClient.post("/api/auth/login", {
      username: email,  
      password,
    });

    if (res.data.token) {
      await AsyncStorage.setItem("authToken", res.data.token);
    }
    return res;
  },

  register: async (data) => {
  return apiClient.post("/api/auth/register/admin", {
    username: data.email,
    password: data.password,
    fullName: data.fullName,
    email: data.email,
  });
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


export const adminAPI = {
  createMatch: (matchData) =>
   apiClient.post("/api/admin/create-match", matchData),
  getMatches: () => apiClient.get("/api/matches"),
  assignReferee: (matchId, refereeId) =>
    apiClient.post("/api/admin/assign-referee", { matchId, refereeId }),
  unassignReferee: (matchId) =>
    apiClient.delete(`/api/admin/unassign-referee/${matchId}`),
};

export const refereeApi = {
  getReferees: () => apiClient.get("/api/referees"),
  getAvailability: () => apiClient.get("/api/referee/availability"),
  assignmentManuel: () => apiClient.post("/api/assignments/auto-assign"),
};


export default apiClient;