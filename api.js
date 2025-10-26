import axios from "axios";

// Backend’in IP adresi ve portu
// Eğer Expo emülatör kullanıyorsan Android için: 10.0.2.2
const API_URL = "http://172.20.10.3000:"; // kendi bilgisayar IP’ni yaz

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};
