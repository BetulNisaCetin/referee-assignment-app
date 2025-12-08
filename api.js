import axios from "axios";

// Backend’in IP adresi ve portu
// Eğer Expo emülatör kullanıyorsan Android için: 10.0.2.2
const API_URL = "http://192.168.1.22:8081:"; // kendi bilgisayar IP’ni yaz

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};
