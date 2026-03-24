import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
    Alert,
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

export default function EditProfileScreen({ navigation, route }) {
  const profile = route?.params?.profile || {};

  const [fullName, setFullName] = useState(profile.full_name || "");
  const [gender, setGender] = useState(profile.gender || "");
  const [birthDate, setBirthDate] = useState(profile.birth_date || "");
  const [nationalId, setNationalId] = useState(profile.national_id || "");
  const [houseNumber, setHouseNumber] = useState(profile.house_number || "");
  const [farmerNumber, setFarmerNumber] = useState(profile.farmer_number || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState(profile.address || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกชื่อ - นามสกุล");
      return;
    }

    if (nationalId && nationalId.trim().length !== 13) {
      Alert.alert("แจ้งเตือน", "เลขบัตรประชาชนต้องมี 13 หลัก");
      return;
    }

    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        Alert.alert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const response = await fetch(`${API_URL}/update_profile.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          full_name: fullName.trim(),
          gender: gender.trim(),
          birth_date: birthDate.trim(),
          national_id: nationalId.trim(),
          house_number: houseNumber.trim(),
          farmer_number: farmerNumber.trim(),
          phone: phone.trim(),
          address: address.trim(),
          profile_image: "",
        }),
      });

      const result = await response.json();
      console.log("UPDATE PROFILE RESULT =", result);

      if (result.success) {
        Alert.alert("สำเร็จ", result.message || "อัปเดตโปรไฟล์สำเร็จ", [
          {
            text: "ตกลง",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("ไม่สำเร็จ", result.message || "อัปเดตโปรไฟล์ไม่สำเร็จ");
      }
    } catch (error) {
      console.log("Update profile error:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>แก้ไขข้อมูลส่วนตัว</Text>
          <Text style={styles.subtitle}>อัปเดตข้อมูลทะเบียนผู้ใช้งาน</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="ชื่อ - นามสกุล"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="male-female-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="เพศ"
              value={gender}
              onChangeText={setGender}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="วันเกิด (YYYY-MM-DD)"
              value={birthDate}
              onChangeText={setBirthDate}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="card-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="เลขบัตรประชาชน"
              value={nationalId}
              onChangeText={setNationalId}
              keyboardType="number-pad"
              maxLength={13}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="home-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="เลขที่บ้าน"
              value={houseNumber}
              onChangeText={setHouseNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="เลขที่เกษตรกร"
              value={farmerNumber}
              onChangeText={setFarmerNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#D4AF37"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="เบอร์โทร"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={[styles.inputContainer, styles.addressContainer]}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#D4AF37"
              style={[styles.inputIcon, { marginTop: 12 }]}
            />
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="ที่อยู่"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5F2" },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4E342E",
  },
  subtitle: {
    fontSize: 15,
    color: "#8D6E63",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    elevation: 5,
    shadowColor: "#4E342E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
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
  addressContainer: {
    alignItems: "flex-start",
    minHeight: 110,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#4E342E",
  },
  addressInput: {
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: "#4E342E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#D4AF37",
    fontSize: 17,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#4E342E",
    fontSize: 17,
    fontWeight: "bold",
  },
});
