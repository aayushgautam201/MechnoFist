import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Animated, Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../home/homeScreen";
import man from "../images/man.jpg";
import { useNavigation } from "@react-navigation/native";
import PaymentMethodsScreen from "../user/paymentScreen";
import { useTheme, ThemeProvider } from "../contexts/themeContext";
import BookingHistoryScreen from "../booking/userBookings";

const { width } = Dimensions.get("window");

const Drawer = createDrawerNavigator();

type DrawerParamList = {
  HomeScreen: undefined;
  BookingsScreen: undefined;
  FavoritesScreen: undefined;
  PaymentScreen: undefined;
  HelpScreen: undefined;
  SettingsScreen: undefined;
};

interface DrawerContentProps {
  navigation: DrawerNavigationProp<DrawerParamList>;
  state: any;
}

interface MenuItem {
  name: string;
  icon: string;
  route: keyof DrawerParamList;
  onPress: () => void;
}

// Custom Drawer Content
const CustomDrawerContent: React.FC<DrawerContentProps> = ({ navigation, state }) => {
  const { theme, isDark } = useTheme(); // Use theme from context
  const user = {
    name: "Ayush",
    image: man,
  };

  const menuItems: MenuItem[] = [
    {
      name: "Home",
      icon: "home-outline",
      route: "HomeScreen",
      onPress: () => navigation.navigate("HomeScreen"),
    },
    {
      name: "My Bookings",
      icon: "calendar-outline",
      route: "BookingHistory",
      onPress: () => navigation.navigate("BookingHistory"),
    },
    {
      name: "Favorites",
      icon: "heart-outline",
      route: "FavoritesScreen",
      onPress: () => navigation.navigate("FavoritesScreen"),
    },
    {
      name: "Payment Methods",
      icon: "card-outline",
      route: "PaymentScreen",
      onPress: () => navigation.navigate("PaymentScreen"),
    },
    {
      name: "Help & Support",
      icon: "help-circle-outline",
      route: "HelpScreen",
      onPress: () => navigation.navigate("HelpScreen"),
    },
    {
      name: "Settings",
      icon: "settings-outline",
      route: "SettingsScreen",
      onPress: () => navigation.navigate("SettingsScreen"),
    },
  ];

  // Animation with spring effect
  const translateX = new Animated.Value(-20);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    try {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          speed: 12,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.warn("Animation failed:", error);
      translateX.setValue(0);
      opacity.setValue(1);
    }
  }, [translateX, opacity]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => console.log("Logged out") },
    ]);
  };

  return (
    <View style={[styles.drawerContainer, { backgroundColor: theme.colors.background }]}>
      {/* Drawer Header */}
      <Animated.View style={[styles.drawerHeader, { opacity, transform: [{ translateX }] }]}>
        <View style={styles.userSection}>
          <Image
            source={user.image}
            style={[styles.drawerProfileImage, { borderColor: theme.colors.border }]}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{user.name}</Text>
            <Text style={[styles.userSubtitle, { color: theme.colors.textLight }]}>Welcome back</Text>
          </View>
        </View>
      </Animated.View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => {
          const isActive = state.routeNames[state.index] === item.route;
          return (
            <Animated.View
              key={index}
              style={[styles.menuItemWrapper, { opacity, transform: [{ translateX }] }]}
            >
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isActive && [styles.activeMenuItem, { backgroundColor: theme.colors.primary }],
                ]}
                onPress={item.onPress}
                activeOpacity={0.6}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    isActive && [styles.activeMenuIcon, { backgroundColor: theme.colors.background }],
                    !isActive && { backgroundColor: theme.colors.backgroundLight },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isActive ? theme.colors.background : theme.colors.textLight}
                  />
                </View>
                <Text
                  style={[
                    styles.menuText,
                    { color: theme.colors.text },
                    isActive && [styles.activeMenuText, { color: theme.colors.background }],
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Drawer Footer */}
      <Animated.View style={[styles.drawerFooter, { opacity, transform: [{ translateX }], borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.colors.background }]}
          onPress={handleLogout}
          activeOpacity={0.6}
        >
          <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.backgroundLight }]}>
            <Ionicons name="log-out-outline" size={22} color={theme.colors.textLight} />
          </View>
          <Text style={[styles.logoutText, { color: theme.colors.textLight }]}>Logout</Text>
        </TouchableOpacity>
        <Text style={[styles.versionText, { color: theme.colors.textLighter }]}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
};

// Custom Header Component
const CustomHeader: React.FC<{ navigation: DrawerNavigationProp<DrawerParamList>; title: string }> = ({
  navigation,
}) => {
  const { theme } = useTheme(); // Use theme from context
  const user = {
    name: "Ayush",
    image: man,
  };

  const navigationHook = useNavigation(); // Renamed to avoid conflict

  const handleNotificationPress = () => {
    navigation.navigate("Notification");
    // Alert.alert("Notifications", "Opening notifications");
  };

  const handleProfilePress = () => {
    navigationHook.navigate("ProfileScreen");
  };

  return (
    <View
      style={[
        styles.customHeader,
        { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
      ]}
    >
      {/* Left - Hamburger Icon */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => navigation.openDrawer()}
        activeOpacity={0.6}
      >
        <Ionicons name="menu-outline" size={28} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Center - Greeting */}
      <View style={styles.headerCenter}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>Hello, {user.name}</Text>
      </View>

      {/* Right - Notification and Profile */}
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationPress}
          activeOpacity={0.6}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          <View
            style={[
              styles.notificationDot,
              { backgroundColor: theme.colors.primary, borderColor: theme.colors.background },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
          activeOpacity={0.6}
        >
          <Image
            source={user.image}
            style={[styles.profileImage, { borderColor: theme.colors.border }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Drawer Navigator
const AppDrawerNavigator: React.FC = () => {
  const { theme } = useTheme(); // Use theme from context

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: width * 0.8,
          borderRightWidth: 0,
          shadowColor: theme.colors.shadow || "rgba(0, 0, 0, 0.05)", // Fallback for shadow
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        drawerType: "front",
        overlayColor: "rgba(0, 0, 0, 0.3)",
        header: ({ navigation, route }) => <CustomHeader navigation={navigation} title={route.name} />,
      }}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      {/* <Drawer.Screen
        name="BookingsScreen"
        component={BookingHistoryScreen}
        options={{
          drawerLabel: "My Bookings",
          drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      /> */}
      <Drawer.Screen
        name="FavoritesScreen"
        component={HomeScreen}
        options={{
          drawerLabel: "Favorites",
          drawerIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      {/* <Drawer.Screen
        name="PaymentScreen"
        component={PaymentMethodsScreen}
        options={{
          drawerLabel: "Payment Methods",
          drawerIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        }}
      /> */}
      <Drawer.Screen
        name="HelpScreen"
        component={HomeScreen}
        options={{
          drawerLabel: "Help & Support",
          drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="SettingsScreen"
        component={HomeScreen}
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

// Wrap the AppDrawerNavigator with ThemeProvider
const AppDrawerWithTheme: React.FC = () => (
  <ThemeProvider>
    <AppDrawerNavigator />
  </ThemeProvider>
);

// Styles
const styles = StyleSheet.create({
  // Custom Header Styles
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.05)", // Fallback shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  hamburgerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
    marginRight: 12,
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  profileButton: {
    borderRadius: 20,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },

  // Drawer Styles
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 48,
    borderBottomWidth: 0,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerProfileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
  },
  userSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  menuSection: {
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  menuItemWrapper: {
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  activeMenuItem: {
    shadowColor: "rgba(0, 0, 0, 0.05)", // Fallback shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeMenuIcon: {},
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeMenuText: {
    fontWeight: "600",
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: "auto",
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
  },
  versionText: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
});

export default AppDrawerWithTheme;