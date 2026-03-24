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

export default function ProductionScreen() {
  const [harvestYear, setHarvestYear] = useState("");
  const [harvestVariety, setHarvestVariety] = useState("");
  const [harvestAmount, setHarvestAmount] = useState("");

  const [freshSales, setFreshSales] = useState("");
  const [processedAmount, setProcessedAmount] = useState("");

  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [beanSource, setBeanSource] = useState("");
  const [giStatus, setGiStatus] = useState("");
  const [saleLocation, setSaleLocation] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const [farmerIncome, setFarmerIncome] = useState("");

  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadProductions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        setProductions([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/get_productions.php?user_id=${userId}`,
      );
      const result = await response.json();

      console.log("PRODUCTIONS RESULT =", result);

      if (result.success) {
        setProductions(Array.isArray(result.data) ? result.data : []);
      } else {
        Alert.alert("ไม่สำเร็จ", result.message || "โหลดข้อมูลผลผลิตไม่สำเร็จ");
      }
    } catch (error) {
      console.log("Load productions error:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProductions();
    }, []),
  );

  const handleSaveProduction = async () => {
    if (!harvestYear.trim() || !productName.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกปีที่เก็บเกี่ยวและชื่อผลิตภัณฑ์");
      return;
    }

    try {
      setSaving(true);

      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        Alert.alert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const response = await fetch(`${API_URL}/create_production.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          garden_id: null,
          product_name: productName.trim(),
          quantity: harvestAmount.trim() || "0",
          unit: "กิโลกรัม",
          harvest_date: "",
          note: "",
          harvest_year: harvestYear.trim(),
          harvest_variety: harvestVariety.trim(),
          harvest_amount: harvestAmount.trim(),
          fresh_sales: freshSales.trim(),
          processed_amount: processedAmount.trim(),
          product_type: productType.trim(),
          product_quantity: productQuantity.trim(),
          bean_source: beanSource.trim(),
          gi_status: giStatus.trim(),
          sale_location: saleLocation.trim(),
          product_price: productPrice.trim(),
          farmer_income: farmerIncome.trim(),
        }),
      });

      const result = await response.json();
      console.log("CREATE PRODUCTION RESULT =", result);

      if (result.success) {
        Alert.alert(
          "สำเร็จ!",
          result.message || "บันทึกข้อมูลผลผลิตเรียบร้อยแล้ว",
        );

        setHarvestYear("");
        setHarvestVariety("");
        setHarvestAmount("");
        setFreshSales("");
        setProcessedAmount("");
        setProductName("");
        setProductType("");
        setProductQuantity("");
        setBeanSource("");
        setGiStatus("");
        setSaleLocation("");
        setProductPrice("");
        setFarmerIncome("");

        loadProductions();
      } else {
        Alert.alert(
          "ไม่สำเร็จ",
          result.message || "บันทึกข้อมูลผลผลิตไม่สำเร็จ",
        );
      }
    } catch (error) {
      console.log("Create production error:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  const renderProductionItem = ({ item }) => (
    <View style={styles.productionCard}>
      <Text style={styles.cardTitle}>{item.product_name || "ผลิตภัณฑ์"}</Text>
      <Text style={styles.cardText}>
        ปีที่เก็บเกี่ยว: {item.harvest_year || "-"}
      </Text>
      <Text style={styles.cardText}>
        พันธุ์กาแฟ: {item.harvest_variety || "-"}
      </Text>
      <Text style={styles.cardText}>
        ปริมาณเก็บเกี่ยว: {item.harvest_amount || "-"}
      </Text>
      <Text style={styles.cardText}>ขายผลสด: {item.fresh_sales || "-"}</Text>
      <Text style={styles.cardText}>
        แปรรูป: {item.processed_amount || "-"}
      </Text>
      <Text style={styles.cardText}>
        ชนิดผลิตภัณฑ์: {item.product_type || "-"}
      </Text>
      <Text style={styles.cardText}>
        ปริมาณผลิตภัณฑ์: {item.product_quantity || "-"}
      </Text>
      <Text style={styles.cardText}>
        แหล่งเมล็ดกาแฟ: {item.bean_source || "-"}
      </Text>
      <Text style={styles.cardText}>GI: {item.gi_status || "-"}</Text>
      <Text style={styles.cardText}>
        สถานที่จำหน่าย: {item.sale_location || "-"}
      </Text>
      <Text style={styles.cardText}>
        ราคาจำหน่าย: {item.product_price || "-"}
      </Text>
      <Text style={styles.cardText}>รายได้: {item.farmer_income || "-"}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E342E" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูลผลผลิต...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={productions}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={renderProductionItem}
        ListHeaderComponent={
          <ScrollView scrollEnabled={false}>
            <View style={styles.header}>
              <Ionicons name="basket" size={50} color="#D4AF37" />
              <Text style={styles.title}>ข้อมูลผลผลิต</Text>
              <Text style={styles.subtitle}>จัดการผลผลิตและรายได้ของคุณ</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="leaf"
                  size={20}
                  color="#4E342E"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>
                  {" "}
                  ข้อมูลการเก็บเกี่ยวต่อปี
                </Text>
              </View>

              <Text style={styles.label}>ปีที่เก็บเกี่ยว</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น พ.ศ. 2566"
                  value={harvestYear}
                  onChangeText={setHarvestYear}
                  keyboardType="numeric"
                />
              </View>

              <Text style={styles.label}>พันธุ์กาแฟ</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="flower-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น อาราบิก้า"
                  value={harvestVariety}
                  onChangeText={setHarvestVariety}
                />
              </View>

              <Text style={styles.label}>
                ปริมาณที่เก็บเกี่ยวได้ (กิโลกรัม)
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="scale-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ระบุน้ำหนักรวม"
                  value={harvestAmount}
                  onChangeText={setHarvestAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.divider} />
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="sync"
                  size={20}
                  color="#4E342E"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}> การจัดสรรผลผลิต</Text>
              </View>

              <Text style={styles.label}>ปริมาณขายผลสด (กิโลกรัม)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ระบุน้ำหนักขายผลสด"
                  value={freshSales}
                  onChangeText={setFreshSales}
                  keyboardType="numeric"
                />
              </View>

              <Text style={styles.label}>ปริมาณที่นำไปแปรรูป (กิโลกรัม)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="cog-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ระบุน้ำหนักที่นำไปแปรรูป"
                  value={processedAmount}
                  onChangeText={setProcessedAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.divider} />
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="cube"
                  size={20}
                  color="#4E342E"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}> ผลิตภัณฑ์แปรรูป</Text>
              </View>

              <Text style={styles.label}>ชื่อผลิตภัณฑ์</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="pricetag-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น กาแฟคั่วเข้มตรา..."
                  value={productName}
                  onChangeText={setProductName}
                />
              </View>

              <Text style={styles.label}>ชนิดผลิตภัณฑ์</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="grid-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น สารกาแฟ, กาแฟคั่ว, กาแฟดริป"
                  value={productType}
                  onChangeText={setProductType}
                />
              </View>

              <Text style={styles.label}>ปริมาณผลิตภัณฑ์ (ระบุหน่วย)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="layers-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 500 ถุง, 100 กิโลกรัม"
                  value={productQuantity}
                  onChangeText={setProductQuantity}
                />
              </View>

              <Text style={styles.label}>แหล่งที่มาของเมล็ดกาแฟ</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="map-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น สวนตัวเอง, รับซื้อจากดอย..."
                  value={beanSource}
                  onChangeText={setBeanSource}
                />
              </View>

              <Text style={styles.label}>
                การขึ้นทะเบียน GI (สิ่งบ่งชี้ทางภูมิศาสตร์)
              </Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    giStatus === "ขึ้นทะเบียนแล้ว" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setGiStatus("ขึ้นทะเบียนแล้ว")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      giStatus === "ขึ้นทะเบียนแล้ว" && styles.toggleTextActive,
                    ]}
                  >
                    ขึ้นทะเบียนแล้ว
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    giStatus === "ไม่ได้ขึ้นทะเบียน" &&
                      styles.toggleButtonActive,
                  ]}
                  onPress={() => setGiStatus("ไม่ได้ขึ้นทะเบียน")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      giStatus === "ไม่ได้ขึ้นทะเบียน" &&
                        styles.toggleTextActive,
                    ]}
                  >
                    ไม่ได้ขึ้นทะเบียน
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>สถานที่จำหน่ายสินค้า</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="storefront-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น ตลาดชุมชน, เพจ Facebook"
                  value={saleLocation}
                  onChangeText={setSaleLocation}
                />
              </View>

              <Text style={styles.label}>ราคาจำหน่าย</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="เช่น 250 บาท/ถุง"
                  value={productPrice}
                  onChangeText={setProductPrice}
                />
              </View>

              <View style={styles.divider} />
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="wallet"
                  size={20}
                  color="#4E342E"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}> รายได้</Text>
              </View>

              <Text style={styles.label}>รายได้ของชาวสวน (บาท/ปี)</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="trending-up-outline"
                  size={20}
                  color="#D4AF37"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ระบุรายได้รวมโดยประมาณ"
                  value={farmerIncome}
                  onChangeText={setFarmerIncome}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={handleSaveProduction}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลผลผลิต"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionListTitle}>รายการผลผลิตของฉัน</Text>
          </ScrollView>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ยังไม่มีข้อมูลผลผลิต</Text>
          </View>
        }
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProductions(true)}
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
  header: { alignItems: "center", marginBottom: 20 },
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#4E342E" },
  sectionListTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: "#EFEBE9", marginVertical: 20 },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#6D4C41",
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
  toggleText: { fontSize: 15, color: "#8D6E63" },
  toggleTextActive: { color: "#D4AF37", fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#4E342E",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 35,
    elevation: 3,
  },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: "#D4AF37", fontSize: 18, fontWeight: "bold" },
  productionCard: {
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
