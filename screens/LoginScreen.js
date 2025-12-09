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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authAPI } from "../api";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Giriş verileri:", { email, password });
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen e-posta ve şifreyi girin.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      console.log("Backend cevabı:", res.data);
      const userType = res.data.user?.userType;
      
      Alert.alert("Başarılı", "Giriş yapıldı!");
      
      // Kullanıcı tipi kontrol et - Yönetici ise Hakem Atama sayfasına git
      if (userType === 'Yönetici') {
        navigation.navigate("Hakem Atama");
      } else {
        navigation.navigate("Ana Sayfa");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        Alert.alert("Hata", err.response.data.message);
      } else {
        Alert.alert("Hata", "Giriş sırasında bir hata oluştu.");
      }
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>⚽</Text>
            </View>
            <Text style={styles.appTitle}>Hakem Uygulaması</Text>
            <Text style={styles.appSubtitle}>Görev Yönetimi</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Tekrar Hoş Geldiniz</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta adresinizi girin"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi girin"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
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
  appTitle: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 4 },
  appSubtitle: { fontSize: 16, color: "#666" },
  formContainer: { width: "100%" },
  formTitle: { fontSize: 24, fontWeight: "600", color: "#333", textAlign: "center", marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: "500", color: "#333", marginBottom: 8 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E1E5E9",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
    color: "#333",
  },
  loginButton: {
    height: 56,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  registerLinkContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  registerLinkText: { fontSize: 16, color: "#666" },
  registerLink: { fontSize: 16, fontWeight: "600", color: "#007AFF" },
});

export default LoginScreen;
