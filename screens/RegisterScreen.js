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

const API_URL = "http://192.168.1.22:8081"; // Backend URL

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
      if (err.response?.data?.message) {
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
            {/* Header */}
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← Geri</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Hesap Oluştur</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınızı ve soyadınızı girin"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E-posta adresinizi girin"
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Doğum Tarihi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="GG/AA/YYYY"
                  placeholderTextColor="#999"
                  value={birthDate}
                  onChangeText={handleBirthDateChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Telefon Numarası</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0555 123 45 67"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={14}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Kullanıcı Tipi</Text>
                <View style={styles.userTypeContainer}>
                  {["Hakem", "Yönetici"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.userTypeButton,
                        userType === type && styles.userTypeButtonActive
                      ]}
                      onPress={() => setUserType(type)}
                    >
                      <Text
                        style={[
                          styles.userTypeButtonText,
                          userType === type && styles.userTypeButtonTextActive
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
              </TouchableOpacity>

              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>Zaten hesabınız var mı? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Giriş')}>
                  <Text style={styles.loginLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backButton: { marginRight: 16 },
  backButtonText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#333' },
  formContainer: { width: '100%' },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#333',
  },
  userTypeContainer: { flexDirection: 'row' },
  userTypeButton: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginRight: 6,
  },
  userTypeButtonActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  userTypeButtonText: { fontSize: 16, fontWeight: '500', color: '#666' },
  userTypeButtonTextActive: { color: '#fff' },
  registerButton: {
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonText: { fontSize: 18, fontWeight: '600', color: '#fff' },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginLinkText: { fontSize: 16, color: '#666' },
  loginLink: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
});

export default RegisterScreen;
