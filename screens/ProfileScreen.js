import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../api";

const LOGO_URL = "https://cdn-icons-png.flaticon.com/128/3219/3219333.png";

export default function ProfileScreen({ navigation, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const showValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "0000-00-00"
    ) {
      return "-";
    }
    return value;
  };

  const loadProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        setProfile(null);
        return;
      }

      const response = await fetch(
        `${API_URL}/get_profile.php?user_id=${userId}`,
      );
      const result = await response.json();

      console.log("PROFILE RESULT =", result);

      if (result.success) {
        setProfile(result.data);
      } else {
        Alert.alert(
          "ไม่สำเร็จ",
          result.message || "โหลดข้อมูลโปรไฟล์ไม่สำเร็จ",
        );
      }
    } catch (error) {
      console.log("Profile error:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const handleLogout = async () => {
    Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ออกจากระบบ",
        style: "destructive",
        onPress: async () => {
          if (onLogout) {
            await onLogout();
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E342E" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>ไม่พบข้อมูลผู้ใช้</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadProfile(true)}
        />
      }
    >
      <View style={styles.header}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} />
        <Text style={styles.title}>โปรไฟล์ของฉัน</Text>
        <Text style={styles.subtitle}>ข้อมูลบัญชีผู้ใช้งาน</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={90} color="#4E342E" />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="person-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>ชื่อ - นามสกุล</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.full_name)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="mail-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>อีเมล</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.email)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="call-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>เบอร์โทร</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.phone)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="location-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>ที่อยู่</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.address)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="male-female-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>เพศ</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.gender)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="calendar-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>วันเกิด</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.birth_date)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="card-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>เลขบัตรประชาชน</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.national_id)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="home-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>เลขที่บ้าน</Text>
        </View>
        <Text style={styles.infoValue}>{showValue(profile?.house_number)}</Text>

        <View style={styles.infoBox}>
          <Ionicons name="document-text-outline" size={20} color="#D4AF37" />
          <Text style={styles.infoLabel}>เลขที่เกษตรกร</Text>
        </View>
        <Text style={styles.infoValue}>
          {showValue(profile?.farmer_number)}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { profile })}
        >
          <Text style={styles.editButtonText}>แก้ไขโปรไฟล์</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5F2" },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8F5F2",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4E342E",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 6,
  },
  infoLabel: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "bold",
    color: "#4E342E",
  },
  infoValue: {
    fontSize: 16,
    color: "#6D4C41",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#EFEBE9",
  },
  editButton: {
    backgroundColor: "#4E342E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  editButtonText: {
    color: "#D4AF37",
    fontSize: 17,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#B71C1C",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
