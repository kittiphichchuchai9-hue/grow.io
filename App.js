import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import EditProfileScreen from "./screens/EditProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import GardenScreen from "./screens/GardenScreen";
import HomeScreen from "./screens/HomeScreen";
import KnowledgeScreen from "./screens/KnowledgeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProductionScreen from "./screens/ProductionScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "GardenTab") {
            iconName = focused ? "leaf" : "leaf-outline";
          } else if (route.name === "ProductionTab") {
            iconName = focused ? "basket" : "basket-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#D4AF37",
        tabBarInactiveTintColor: "#8D6E63",
        tabBarStyle: {
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderTopColor: "#EFEBE9",
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "หน้าหลัก" }}
      />
      <Tab.Screen
        name="GardenTab"
        component={GardenScreen}
        options={{ title: "ข้อมูลสวน" }}
      />
      <Tab.Screen
        name="ProductionTab"
        component={ProductionScreen}
        options={{ title: "ผลผลิต" }}
      />
      <Tab.Screen name="ProfileTab" options={{ title: "โปรไฟล์" }}>
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  const checkLoginStatus = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      setIsLoggedIn(!!userId);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setCheckingLogin(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem("user_data");
    setIsLoggedIn(false);
  };

  if (checkingLogin) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F5F2",
        }}
      >
        <ActivityIndicator size="large" color="#4E342E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <MainTabs {...props} onLogout={handleLogout} />}
          </Stack.Screen>

          <Stack.Screen
            name="Knowledge"
            component={KnowledgeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
