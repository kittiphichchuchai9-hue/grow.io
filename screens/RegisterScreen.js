import { Ionicons } from "@expo/vector-icons";
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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("แจ้งเตือน", "รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    if (password.length < 6) {
      Alert.alert("แจ้งเตือน", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("สำเร็จ", result.message, [
          {
            text: "ตกลง",
            onPress: () => navigation.navigate("Login"),
          },
        ]);

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("ไม่สำเร็จ", result.message || "สมัครสมาชิกไม่สำเร็จ");
      }
    } catch (error) {
      console.log("Register error:", error);
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
          <Text style={styles.title}>สร้างบัญชีใหม่</Text>
          <Text style={styles.subtitle}>เข้าร่วมเป็นส่วนหนึ่งกับ Grow.IO</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="ชื่อ - นามสกุล..."
              value={name}
              onChangeText={setName}
            />
          </View>

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

          <View style={styles.inputContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="ยืนยันรหัสผ่านอีกครั้ง..."
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>มีบัญชีอยู่แล้ว? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>เข้าสู่ระบบ</Text>
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
  logo: { width: 70, height: 70, marginBottom: 10 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 5,
  },
  subtitle: { fontSize: 16, color: "#8D6E63" },
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
  registerButton: {
    backgroundColor: "#4E342E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: { color: "#8D6E63", fontSize: 16 },
  loginLink: { color: "#D4AF37", fontSize: 16, fontWeight: "bold" },
});
