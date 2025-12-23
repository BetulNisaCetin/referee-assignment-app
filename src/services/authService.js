import api from "../api/api";
import * as SecureStore from "expo-secure-store";

export const login = async (username, password) => {
  const response = await api.post("/api/auth/login", {
    username,
    password,
  });

  const token = response.data.token;
  await SecureStore.setItemAsync("token", token);

  return token;
};

