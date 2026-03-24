import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { API_URL } from "../api";

export default function GardenScreen() {
  const [location, setLocation] = useState("");
  const [numberOfGardens, setNumberOfGardens] = useState("");
  const [areaSize, setAreaSize] = useState("");
  const [soilCondition, setSoilCondition] = useState("");
  const [hasWaterSource, setHasWaterSource] = useState("");
  const [hasWaterSystem, setHasWaterSystem] = useState("");
  const [waterSystemType, setWaterSystemType] = useState("");
  const [coffeeVariety, setCoffeeVariety] = useState("");

  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadGardens = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        setGardens([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/get_gardens.php?user_id=${userId}`,
      );
      const result = await response.json();

      console.log("GARDENS RESULT =", result);

      if (result.success) {
        setGardens(Array.isArray(result.data) ? result.data : []);
      } else {
        Alert.alert("ไม่สำเร็จ", result.message || "โหลดข้อมูลสวนไม่สำเร็จ");
      }
    } catch (error) {
      console.log("Load gardens error:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGardens();
    }, []),
  );

  const handleSaveGarden = async () => {
    if (!location.trim() || !areaSize.trim()) {
      Alert.alert(
        "แจ้งเตือน",
        "กรุณากรอกข้อมูลที่ตั้งและขนาดพื้นที่ให้ครบถ้วน",
      );
      return;
    }

    try {
      setSaving(true);

      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        Alert.alert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const response = await fetch(`${API_URL}/create_garden.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          garden_name: "สวนกาแฟ",
          location: location.trim(),
          area_size: areaSize.trim(),
          plant_type: "กาแฟ",
          number_of_gardens: numberOfGardens.trim(),
          soil_condition: soilCondition.trim(),
          has_water_source: hasWaterSource.trim(),
          has_water_system: hasWaterSystem.trim(),
          water_system_type: waterSystemType.trim(),
          coffee_variety: coffeeVariety.trim(),
        }),
      });

      const result = await response.json();
      console.log("CREATE GARDEN RESULT =", result);

      if (result.success) {
        Alert.alert(
          "สำเร็จ!",
          result.message || "บันทึกข้อมูลสวนกาแฟเรียบร้อยแล้ว",
        );

        setLocation("");
        setNumberOfGardens("");
        setAreaSize("");
        setSoilCondition("");
        setHasWaterSource("");
        setHasWaterSystem("");
        setWaterSystemType("");
        setCoffeeVariety("");

        loadGardens();
      } else {
        Alert.alert("ไม่สำเร็จ", result.message || "บันทึกข้อมูลสวนไม่สำเร็จ");
      }
    } catch (error) {
      console.log("Create garden error:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  const renderGardenItem = ({ item }) => (
    <View style={styles.gardenCard}>
      <Text style={styles.cardTitle}>สวนกาแฟ</Text>

      <Text style={styles.cardText}>ที่ตั้ง: {item.location || "-"}</Text>
      <Text style={styles.cardText}>
        จำนวนสวน: {item.number_of_gardens || "-"}
      </Text>
      <Text style={styles.cardText}>ขนาดพื้นที่: {item.area_size || "-"}</Text>
      <Text style={styles.cardText}>สภาพดิน: {item.soil_condition || "-"}</Text>
      <Text style={styles.cardText}>
        แหล่งน้ำ: {item.has_water_source || "-"}
      </Text>
      <Text style={styles.cardText}>
        ระบบน้ำ: {item.has_water_system || "-"}
      </Text>
      <Text style={styles.cardText}>
        ชนิดระบบน้ำ: {item.water_system_type || "-"}
      </Text>
      <Text style={styles.cardText}>
        พันธุ์กาแฟ: {item.coffee_variety || "-"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E342E" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูลสวน...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={gardens}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={renderGardenItem}
        ListHeaderComponent={
          <ScrollView scrollEnabled={false}>
            <View style={styles.header}>
              <Ionicons name="leaf" size={50} color="#D4AF37" />
              <Text style={styles.title}>ข้อมูลสวนกาแฟ</Text>
              <Text style={styles.subtitle}>
                จัดการรายละเอียดพื้นที่การเกษตรของคุณ
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>ที่ตั้ง</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ระบุพิกัดหรือที่ตั้งสวน"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <Text style={styles.label}>
                จำนวนสวนที่มีใช้การปลูกกาแฟ (แห่ง)
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="map-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 2"
                  value={numberOfGardens}
                  onChangeText={setNumberOfGardens}
                  keyboardType="numeric"
                />
              </View>

              <Text style={styles.label}>ขนาดพื้นที่ปลูกกาแฟ</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="expand-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 15 ไร่ 2 งาน"
                  value={areaSize}
                  onChangeText={setAreaSize}
                />
              </View>

              <Text style={styles.label}>สภาพดิน</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="earth-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น ดินร่วนปนทราย"
                  value={soilCondition}
                  onChangeText={setSoilCondition}
                />
              </View>

              <Text style={styles.label}>แหล่งน้ำ</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    hasWaterSource === "มี" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setHasWaterSource("มี")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      hasWaterSource === "มี" && styles.toggleTextActive,
                    ]}
                  >
                    มี
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    hasWaterSource === "ไม่มี" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setHasWaterSource("ไม่มี")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      hasWaterSource === "ไม่มี" && styles.toggleTextActive,
                    ]}
                  >
                    ไม่มี
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>ระบบน้ำ</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    hasWaterSystem === "มี" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setHasWaterSystem("มี")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      hasWaterSystem === "มี" && styles.toggleTextActive,
                    ]}
                  >
                    มี
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    hasWaterSystem === "ไม่มี" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setHasWaterSystem("ไม่มี")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      hasWaterSystem === "ไม่มี" && styles.toggleTextActive,
                    ]}
                  >
                    ไม่มี
                  </Text>
                </TouchableOpacity>
              </View>

              {hasWaterSystem === "มี" && (
                <View>
                  <Text style={styles.label}>ระบุชนิดระบบน้ำ</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="water-outline"
                      size={20}
                      color="#D4AF37"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="เช่น สปริงเกอร์, น้ำหยด"
                      value={waterSystemType}
                      onChangeText={setWaterSystemType}
                    />
                  </View>
                </View>
              )}

              <Text style={styles.label}>พันธุ์กาแฟ (ต้น)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="nutrition-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น อาราบิก้า 500 ต้น"
                  value={coffeeVariety}
                  onChangeText={setCoffeeVariety}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={handleSaveGarden}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลสวน"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>รายการสวนของฉัน</Text>
          </ScrollView>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ยังไม่มีข้อมูลสวน</Text>
          </View>
        }
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadGardens(true)}
          />
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5F2" },
  content: { padding: 20, paddingTop: 20, paddingBottom: 40 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8F5F2",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 12, fontSize: 16, color: "#4E342E" },
  header: { alignItems: "center", marginBottom: 25 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4E342E",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: { fontSize: 16, color: "#8D6E63", textAlign: "center" },
  form: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#4E342E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 8,
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEBE9",
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: "#4E342E" },
  toggleContainer: { flexDirection: "row", justifyContent: "space-between" },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EFEBE9",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  toggleButtonActive: { backgroundColor: "#4E342E", borderColor: "#4E342E" },
  toggleText: { fontSize: 16, color: "#8D6E63" },
  toggleTextActive: { color: "#D4AF37", fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#4E342E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    elevation: 3,
  },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: "#D4AF37", fontSize: 18, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 14,
  },
  gardenCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EFEBE9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    color: "#6D4C41",
    marginBottom: 6,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    color: "#8D6E63",
    fontSize: 16,
  },
});
