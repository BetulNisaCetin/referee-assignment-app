import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const API_URL = "http://172.20.10.3:3000"; // Backend URL

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("Hakem");

  const formatBirthDate = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  };

  const handleBirthDateChange = (text) => setBirthDate(formatBirthDate(text));

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 8)
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
  };

  const handlePhoneChange = (text) => setPhoneNumber(formatPhoneNumber(text));

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/register`, {
        name: fullName,
        email,
        password,
        birthDate,
        phone: phoneNumber,
        userType,
      });
      Alert.alert("Başarılı", "Kayıt tamamlandı!");
      navigation.navigate("Giriş");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message) {
        Alert.alert("Hata", err.response.data.message);
      } else {
        Alert.alert("Hata", "Kayıt sırasında bir hata oluştu.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.headerTitle}>Hesap Oluştur</Text>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Doğum Tarihi GG/AA/YYYY"
                value={birthDate}
                onChangeText={handleBirthDateChange}
                keyboardType="numeric"
                maxLength={10}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefon Numarası"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={14}
              />

              <View style={styles.userTypeContainer}>
                {["Hakem", "Yönetici"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.userTypeButton,
                      userType === type && styles.userTypeButtonActive,
                    ]}
                    onPress={() => setUserType(type)}
                  >
                    <Text
                      style={[
                        styles.userTypeButtonText,
                        userType === type && styles.userTypeButtonTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Giriş")}>
                <Text style={styles.loginLink}>Zaten hesabınız var? Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  formContainer: { width: "100%" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  userTypeContainer: { flexDirection: "row", marginBottom: 12 },
  userTypeButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    backgroundColor: "#f0f0f0",
  },
  userTypeButtonActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  userTypeButtonText: { color: "#333" },
  userTypeButtonTextActive: { color: "#fff" },
  registerButton: {
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  registerButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loginLink: { color: "#007AFF", textAlign: "center", marginTop: 12 },
});

export default RegisterScreen;
