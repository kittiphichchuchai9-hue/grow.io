import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const quickActions = [
    {
      id: 1,
      title: "จัดการสวน",
      icon: "leaf",
      route: "GardenTab",
      color: "#4CAF50",
    },
    {
      id: 2,
      title: "ผลผลิต",
      icon: "basket",
      route: "ProductionTab",
      color: "#FF9800",
    },
    {
      id: 3,
      title: "สถิติ/รายได้",
      icon: "bar-chart",
      route: "ProfileTab",
      color: "#2196F3",
    },
    {
      id: 4,
      title: "ความรู้เกษตร",
      icon: "book",
      route: "Knowledge",
      color: "#9C27B0",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>
              ยินดีต้อนรับเข้าสู่สวนของท่าน
            </Text>
            <Text style={styles.userName}>สวนกาแฟของคุณ</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileTab")}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3069/3069172.png",
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>ภาพรวมสวนกาแฟของคุณ</Text>
            <Ionicons name="analytics-outline" size={24} color="#D4AF37" />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>พื้นที่ (ไร่)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>จำนวนสวน</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1.2K</Text>
              <Text style={styles.statLabel}>ผลผลิต (กก.)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>เมนูลัด</Text>
        <View style={styles.actionGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.route)}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: action.color + "15" },
                ]}
              >
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>อัปเดตตลาดกาแฟวันนี้</Text>
        <View style={styles.newsCard}>
          <View style={styles.newsIconContainer}>
            <Ionicons name="trending-up" size={30} color="#FFF" />
          </View>
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>ราคากาแฟอาราบิก้า (สาร)</Text>
            <Text style={styles.newsSubtitle}>
              ปรับตัวขึ้น +5 บาท/กก. จากสัปดาห์ที่แล้ว
            </Text>
            <Text style={styles.newsPrice}>เฉลี่ย 180 - 220 บาท/กก.</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5F2" },
  content: { padding: 20, paddingTop: 60 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greetingText: { fontSize: 16, color: "#8D6E63", marginBottom: 4 },
  userName: { fontSize: 24, fontWeight: "bold", color: "#4E342E" },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: "#D4AF37",
  },

  summaryCard: {
    backgroundColor: "#4E342E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 6,
    shadowColor: "#4E342E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitle: { fontSize: 18, fontWeight: "bold", color: "#D4AF37" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  statLabel: { fontSize: 13, color: "#EFEBE9" },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#8D6E63",
    opacity: 0.5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionButton: {
    width: (width - 55) / 2,
    backgroundColor: "#FFF",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#4E342E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionText: { fontSize: 15, fontWeight: "600", color: "#4E342E" },

  newsCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#4E342E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  newsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  newsContent: { flex: 1 },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 4,
  },
  newsSubtitle: { fontSize: 13, color: "#8D6E63", marginBottom: 8 },
  newsPrice: { fontSize: 15, fontWeight: "bold", color: "#4CAF50" },
});
