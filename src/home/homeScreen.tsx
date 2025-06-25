import type React from "react";
import { useState, useEffect } from "react"; // Added useEffect
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/themeContext"; // Note: Ensure path is correct
import man from "../images/man.jpg";

const { width } = Dimensions.get("window");

interface Employee {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  price: number;
  image: string;
  available: boolean;
}

interface Service {
  id: string;
  name: string;
  icon: string;
}

const HomeScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Debug theme changes
  useEffect(() => {
    console.log("HomeScreen theme updated:", theme);
  }, [theme]);

  // Mock data (unchanged)
  const services: Service[] = [
    { id: "1", name: "Cleaning", icon: "sparkles-outline" },
    { id: "2", name: "Plumbing", icon: "water-outline" },
    { id: "3", name: "Electric", icon: "flash-outline" },
    { id: "4", name: "Repair", icon: "build-outline" },
    { id: "5", name: "Repair", icon: "build-outline" },
    { id: "6", name: "Repair", icon: "build-outline" },
  ];

  const nearbyWorkers: Employee[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      category: "Electrician",
      rating: 4.8,
      distance: "0.5 km",
      price: 500,
      image: man,
      available: true,
    },
    {
      id: "2",
      name: "Amit Singh",
      category: "Plumber",
      rating: 4.6,
      distance: "1.2 km",
      price: 400,
      image: man,
      available: true,
    },
    {
      id: "3",
      name: "Suresh Yadav",
      category: "Cleaner",
      rating: 4.9,
      distance: "0.8 km",
      price: 300,
      image: man,
      available: false,
    },
  ];

  const navigation = useNavigation();

  const handleServicePress = (serviceId: string) => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  const handleWorkerPress = (worker: Employee) => {
    // Alert.alert("Worker Selected", `You selected ${worker.name}`);
    navigation.navigate("EmployeeDetailScreen");
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={[styles.serviceCard, selectedService === item.id && styles.serviceCardSelected]}
      onPress={() => handleServicePress(item.id)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={item.icon as any}
        size={24}
        color={selectedService === item.id ? theme.colors.background : theme.colors.textLight}
      />
      <Text
        style={[styles.serviceName, selectedService === item.id && styles.serviceNameSelected, { color: theme.colors.text }]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderWorkerCard = ({ item }: { item: Employee }) => (
    <TouchableOpacity
      style={[styles.workerCard, { backgroundColor: theme.colors.backgroundLight, borderColor: theme.colors.border }]}
      onPress={() => handleWorkerPress(item)}
      activeOpacity={0.8}
      disabled={!item.available}
    >
      <View style={styles.workerHeader}>
        <Image source={item.image} style={styles.workerImage} />
        <View style={styles.workerInfo}>
          <Text style={[styles.workerName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.workerCategory, { color: theme.colors.textLight }]}>
            {item.category}
          </Text>
        </View>
        <View style={styles.workerMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={theme.colors.warning} />
            <Text style={[styles.rating, { color: theme.colors.text }]}>{item.rating}</Text>
          </View>
          <Text style={[styles.distance, { color: theme.colors.textLighter }]}>{item.distance}</Text>
        </View>
      </View>
      <View style={styles.workerFooter}>
        <Text style={[styles.price, { color: theme.colors.text }]}>₹{item.price}/hr</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: item.available ? theme.colors.success : theme.colors.textLighter }]}
        >
          <Text style={[styles.statusText, { color: theme.colors.background }]}>{item.available ? "Available" : "Busy"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.backgroundLight }]}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textLight} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="What service do you need?"
              placeholderTextColor={theme.colors.textLighter}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Services</Text>
          <FlatList
            data={services}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} activeOpacity={0.8} onPress={() => navigation.navigate("BookingScreen")}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.backgroundLight }]}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.textLight }]}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} activeOpacity={0.8} onPress={() => navigation.navigate("ScheduleScreen")}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.backgroundLight }]}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.textLight }]}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} activeOpacity={0.8}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.backgroundLight }]}>
              <Ionicons name="repeat-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.textLight }]}>Repeat</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Workers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Nearby Professionals</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("EmployeeScreen")}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={nearbyWorkers}
            renderItem={renderWorkerCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent</Text>
          <TouchableOpacity onPress={() => navigation.navigate("JobDetailScreen")}>
            <View style={[styles.recentCard, { backgroundColor: theme.colors.backgroundLight, borderColor: theme.colors.border }]}>
              <View style={styles.recentIcon}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              </View>
              <View style={styles.recentInfo}>
                <Text style={[styles.recentTitle, { color: theme.colors.text }]}>
                  Electrical work completed
                </Text>
                <Text style={[styles.recentSubtitle, { color: theme.colors.textLight }]}>
                  by Rajesh Kumar • 2 days ago
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.recentAction, { color: theme.colors.primary }]}>Rate</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.colors.backgroundLight, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="home" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => navigation.navigate("ChatScreen")}>
          <Ionicons name="chatbubble-outline" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 24,
    paddingRight: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 20,
  },
  servicesList: {
    paddingHorizontal: 24,
  },
  serviceCard: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  serviceCardSelected: {
    // No styles defined, as per original
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  serviceNameSelected: {
    // No styles defined, as per original
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 32,
    justifyContent: "space-between",
  },
  quickAction: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  workerCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  workerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  workerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  workerCategory: {
    fontSize: 14,
  },
  workerMeta: {
    alignItems: "flex-end",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  distance: {
    fontSize: 12,
  },
  workerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  recentIcon: {
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: 12,
  },
  recentAction: {
    fontSize: 14,
    fontWeight: "500",
  },
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
});

export default HomeScreen;