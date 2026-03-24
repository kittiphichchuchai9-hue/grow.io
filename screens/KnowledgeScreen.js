import { Ionicons } from "@expo/vector-icons";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function KnowledgeScreen({ navigation }) {
  const articles = [
    {
      id: "1",
      title: "เทคนิคการปลูกกาแฟอาราบิก้าให้ได้คุณภาพ",
      category: "การปลูก",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=500&auto=format&fit=crop",
      date: "20 มี.ค. 2567",
    },
    {
      id: "2",
      title: "การดูแลรักษาสวนกาแฟในช่วงฤดูแล้ง",
      category: "การดูแล",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500&auto=format&fit=crop",
      date: "15 มี.ค. 2567",
    },
    {
      id: "3",
      title: "ขั้นตอนการแปรรูปกาแฟแบบ Dry Process",
      category: "การแปรรูป",
      image:
        "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=500&auto=format&fit=crop",
      date: "10 มี.ค. 2567",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.articleCard}>
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <View style={styles.articleInfo}>
        <Text style={styles.categoryTag}>{item.category}</Text>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <View style={styles.articleFooter}>
          <Ionicons name="calendar-outline" size={14} color="#8D6E63" />
          <Text style={styles.articleDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#4E342E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ความรู้ทางการเกษตร</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>บทความยอดนิยม</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F5F2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#4E342E" },
  backButton: { padding: 5 },
  listContent: { padding: 20 },
  listHeader: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#4E342E" },
  articleCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleImage: { width: "100%", height: 180 },
  articleInfo: { padding: 15 },
  categoryTag: {
    backgroundColor: "#D4AF3720",
    color: "#D4AF37",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 10,
  },
  articleFooter: { flexDirection: "row", alignItems: "center" },
  articleDate: { fontSize: 12, color: "#8D6E63", marginLeft: 5 },
});
