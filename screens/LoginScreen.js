import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../api";

const LOGO_URL = "https://cdn-icons-png.flaticon.com/128/3219/3219333.png";

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider) => {
    Alert.alert(
      "กำลังพัฒนา",
      `ระบบเข้าสู่ระบบด้วย ${provider} จะเปิดใช้งานเร็วๆ นี้!`,
    );
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const result = await response.json();
      console.log("LOGIN RESULT =", result);

      if (result.success) {
        await AsyncStorage.setItem("user_id", String(result.data.id));
        await AsyncStorage.setItem("user_data", JSON.stringify(result.data));

        Alert.alert("สำเร็จ", result.message, [
          {
            text: "ตกลง",
            onPress: () => {
              if (onLoginSuccess) {
                onLoginSuccess();
              }
            },
          },
        ]);

        setEmail("");
        setPassword("");
      } else {
        Alert.alert(
          "เข้าสู่ระบบไม่สำเร็จ",
          result.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        );
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={{ uri: LOGO_URL }} style={styles.logo} />
          <Text style={styles.title}>Grow.IO</Text>
          <Text style={styles.subtitle}>แอปพลิเคชันเพื่อเกษตรกรยุคใหม่</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>เข้าสู่ระบบ</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="อีเมลของคุณ..."
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="รหัสผ่าน..."
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>ลืมรหัสผ่านใช่ไหม?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>หรือเข้าสู่ระบบด้วย</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <Ionicons name="logo-facebook" size={24} color="#FFF" />
              <Text style={[styles.socialButtonText, { color: "#FFF" }]}>
                Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: "#FFF",
                  borderWidth: 1,
                  borderColor: "#D4AF37",
                },
              ]}
              onPress={() => handleSocialLogin("Google")}
            >
              <Ionicons name="logo-google" size={24} color="#D4AF37" />
              <Text style={[styles.socialButtonText, { color: "#4E342E" }]}>
                Google
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>ยังไม่มีบัญชีใช่ไหม? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>สมัครสมาชิกที่นี่</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5F2" },
  scrollContainer: { flexGrow: 1, padding: 20, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 30 },
  logo: { width: 90, height: 90, marginBottom: 15 },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 5,
  },
  subtitle: { fontSize: 16, color: "#8D6E63", marginBottom: 10 },
  form: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 25,
    elevation: 6,
    shadowColor: "#4E342E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EFEBE9",
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: "#4E342E" },
  forgotButton: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { color: "#D4AF37", fontSize: 14, fontWeight: "bold" },
  loginButton: {
    backgroundColor: "#4E342E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EFEBE9" },
  dividerText: { marginHorizontal: 15, color: "#8D6E63", fontSize: 14 },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 1,
  },
  socialButtonText: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  registerText: { color: "#8D6E63", fontSize: 16 },
  registerLink: { color: "#D4AF37", fontSize: 16, fontWeight: "bold" },
});
