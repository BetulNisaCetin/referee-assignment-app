import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { authAPI,adminAPI } from "../api";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen e-posta ve şifreyi girin.");
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.login(email,password)

      console.log("ress",res.data)
      Alert.alert("Başarılı", "Giriş yapıldı!");
      navigation.replace("Ana Sayfa");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);

      Alert.alert(
        "Hata",
        err.response?.data?.error || "Giriş başarısız"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>⚽</Text>
            </View>
            <Text style={styles.appTitle}>Hakem Uygulaması</Text>
            <Text style={styles.appSubtitle}>Görev Yönetimi</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Tekrar Hoş Geldiniz</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Text>
            </TouchableOpacity>

            <View style={styles.registerLinkContainer}>
              <Text style={styles.registerLinkText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Kayıt")}>
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardAvoidingView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 48 },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: { fontSize: 40, color: "#fff" },
  appTitle: { fontSize: 28, fontWeight: "bold", color: "#333" },
  appSubtitle: { fontSize: 16, color: "#666" },
  formContainer: { width: "100%" },
  formTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E1E5E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
  },
  loginButton: {
    height: 56,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: { fontSize: 18, color: "#fff" },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerLinkText: { fontSize: 16, color: "#666" },
  registerLink: { fontSize: 16, fontWeight: "600", color: "#007AFF" },
});

export default LoginScreen;
