"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../contexts/themeContext"
import man from "../images/man.jpg"

const { width, height } = Dimensions.get("window")

interface Booking {
  id: string
  clientName: string
  serviceType: string
  time: string
  location: string
  status: "Pending" | "Accepted" | "Completed" | "In Progress"
  clientImage?: string
  priority: "high" | "medium" | "low"
  price: number
  distance: string
  phone: string
}

interface DashboardStats {
  todayJobs: number
  weeklyJobs: number
  rating: number
  responseRate: number
  completionRate: number
  totalEarnings: number
}

const EmployeeHomeScreen: React.FC = () => {
  const { theme, isDark } = useTheme()
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigation = useNavigation()

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const dashboardStats: DashboardStats = {
    todayJobs: 3,
    weeklyJobs: 18,
    rating: 4.8,
    responseRate: 98,
    completionRate: 96,
    totalEarnings: 48500,
  }

  const nextBooking: Booking = {
    id: "1",
    clientName: "Anita Sharma",
    serviceType: "Electrical Panel Installation",
    time: "2:00 PM",
    location: "Sector 15, Noida",
    status: "Accepted",
    clientImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    priority: "high",
    price: 1200,
    distance: "2.3 km",
    phone: "+91 98765 43210",
  }

  const upcomingJobs: Booking[] = [
    {
      id: "2",
      clientName: "Vikram Singh",
      serviceType: "AC Repair",
      time: "4:30 PM",
      location: "Gurgaon",
      status: "Pending",
      clientImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      priority: "medium",
      price: 800,
      distance: "1.8 km",
      phone: "+91 98765 43211",
    },
    {
      id: "3",
      clientName: "Priya Patel",
      serviceType: "Wiring Check",
      time: "Tomorrow, 10:00 AM",
      location: "Delhi",
      status: "Pending",
      clientImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      priority: "low",
      price: 600,
      distance: "3.1 km",
      phone: "+91 98765 43212",
    },
    {
      id: "4",
      clientName: "Rohan Desai",
      serviceType: "Socket Installation",
      time: "Tomorrow, 2:00 PM",
      location: "Faridabad",
      status: "Accepted",
      clientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      priority: "high",
      price: 900,
      distance: "4.2 km",
      phone: "+91 98765 43213",
    },
  ]

  const quickActions = [
    { id: 1, title: "Emergency", icon: "flash", color: "#EF4444", count: 2 },
    { id: 2, title: "Messages", icon: "chatbubble", color: "#3B82F6", count: 5 },
    { id: 3, title: "Earnings", icon: "wallet", color: "#10B981", amount: "₹2,450" },
    { id: 4, title: "Support", icon: "help-circle", color: "#8B5CF6", count: null },
  ]

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "#10B981"
      case "In Progress":
        return "#3B82F6"
      case "Accepted":
        return "#8B5CF6"
      case "Pending":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444"
      case "medium":
        return "#F59E0B"
      case "low":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const ProfileHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: theme.colors.backgroundLight }]}>
      <View style={styles.headerContent}>
        {/* Main Header Row */}
        <View style={styles.headerRow}>
          {/* Left Side - Profile */}
          <TouchableOpacity style={styles.profileSection} activeOpacity={0.8} onPress={() => navigation.navigate("EmployeeProfileScreen")}>
            <View style={styles.avatarContainer}>
              <Image source={man} style={styles.profileImage} />
              <View style={[styles.statusDot, { backgroundColor: isOnline ? "#10B981" : "#EF4444" }]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.greetingText, { color: theme.colors.text }]}>{getGreeting()}, Rajesh!</Text>
              <Text style={[styles.profileRole, { color: theme.colors.textLight }]}>Senior Electrician</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={[styles.ratingText, { color: theme.colors.textLight }]}>
                  {dashboardStats.rating} Rating
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Side - Notifications */}
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Availability Section */}
        <View style={styles.availabilitySection}>
          <View style={styles.availabilityContent}>
            <View style={styles.availabilityInfo}>
              <Ionicons
                name={isOnline ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={isOnline ? "#10B981" : "#6B7280"}
              />
              <Text style={[styles.availabilityLabel, { color: theme.colors.text }]}>
                You are currently {isOnline ? "available" : "unavailable"} for new jobs
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.availabilityToggle, { backgroundColor: isOnline ? "#10B981" : "#6B7280" }]}
              onPress={() => setIsOnline(!isOnline)}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleSlider, { transform: [{ translateX: isOnline ? 20 : 2 }] }]} />
            </TouchableOpacity>
          </View>

          {!isOnline && (
            <Text style={[styles.availabilityNote, { color: theme.colors.textLight }]}>
              Turn on availability to receive new job requests
            </Text>
          )}
        </View>
      </View>
    </View>
  )

  const NextJobCard = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Next Job</Text>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.nextJobTime, { color: theme.colors.primary }]}>Starting in 45 mins</Text>
        </View>
      </View>

      <View style={[styles.nextJobCard, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.priorityStrip}>
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(nextBooking.priority) }]} />
        </View>

        <View style={styles.jobHeader}>
          <View style={styles.clientSection}>
            <Image source={{ uri: nextBooking.clientImage }} style={styles.clientAvatar} />
            <View style={styles.clientInfo}>
              <Text style={[styles.clientName, { color: theme.colors.text }]}>{nextBooking.clientName}</Text>
              <Text style={[styles.serviceType, { color: theme.colors.textLight }]}>{nextBooking.serviceType}</Text>
              <View style={styles.jobMetaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={12} color={theme.colors.textLight} />
                  <Text style={[styles.metaText, { color: theme.colors.textLight }]}>{nextBooking.distance}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={12} color={theme.colors.textLight} />
                  <Text style={[styles.metaText, { color: theme.colors.textLight }]}>Today, {nextBooking.time}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.jobPriceSection}>
            <Text style={[styles.jobPrice, { color: "#10B981" }]}>₹{nextBooking.price}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(nextBooking.status) }]}>
              <Text style={styles.statusBadgeText}>{nextBooking.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.locationSection}>
          <Ionicons name="location" size={16} color={theme.colors.primary} />
          <Text style={[styles.locationText, { color: theme.colors.text }]}>{nextBooking.location}</Text>
        </View>

        <View style={styles.jobActions}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton} activeOpacity={0.8}>
              <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navigationButton} activeOpacity={0.8}>
              <Ionicons name="navigate" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Navigate</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.startButton, { backgroundColor: theme.colors.primary }]} activeOpacity={0.8}>
            <Ionicons name="play" size={18} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Job</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const QuickActionsGrid = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>

      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionCard, { backgroundColor: theme.colors.backgroundLight }]}
            activeOpacity={0.8}
          >
            <View style={styles.actionHeader}>
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              {action.count && (
                <View style={[styles.actionBadge, { backgroundColor: action.color }]}>
                  <Text style={styles.actionBadgeText}>{action.count}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{action.title}</Text>
            {action.amount && <Text style={[styles.actionAmount, { color: action.color }]}>{action.amount}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const TodayStatsCard = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Performance</Text>

      <View style={[styles.statsCard, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="briefcase" size={20} color="#0284C7" />
            </View>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{dashboardStats.todayJobs}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Jobs Today</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            </View>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{dashboardStats.completionRate}%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Completion</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="time" size={20} color="#D97706" />
            </View>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{dashboardStats.responseRate}%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Response</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.colors.text }]}>Weekly Progress</Text>
            <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
              {dashboardStats.weeklyJobs}/25 jobs
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(dashboardStats.weeklyJobs / 25) * 100}%` }]} />
          </View>
        </View>
      </View>
    </View>
  )

  const UpcomingJobsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Upcoming Jobs</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All ({upcomingJobs.length})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={upcomingJobs}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.upcomingJobsList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.upcomingJobCard, { backgroundColor: theme.colors.backgroundLight }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("JobDetailPage")}
          >
            <View style={styles.upcomingJobHeader}>
              <Image source={{ uri: item.clientImage }} style={styles.upcomingClientAvatar} />
              <View style={[styles.upcomingPriorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
            </View>

            <Text style={[styles.upcomingJobTitle, { color: theme.colors.text }]}>{item.serviceType}</Text>
            <Text style={[styles.upcomingClientName, { color: theme.colors.textLight }]}>{item.clientName}</Text>

            <View style={styles.upcomingJobMeta}>
              <View style={styles.upcomingMetaRow}>
                <Ionicons name="time-outline" size={12} color={theme.colors.textLight} />
                <Text style={[styles.upcomingMetaText, { color: theme.colors.textLight }]}>{item.time}</Text>
              </View>
              <View style={styles.upcomingMetaRow}>
                <Ionicons name="location-outline" size={12} color={theme.colors.textLight} />
                <Text style={[styles.upcomingMetaText, { color: theme.colors.textLight }]}>{item.distance}</Text>
              </View>
            </View>

            <View style={styles.upcomingJobFooter}>
              <Text style={[styles.upcomingJobPrice, { color: "#10B981" }]}>₹{item.price}</Text>
              <View style={[styles.upcomingStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.upcomingStatusText}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  )

  const RecentActivitySection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>

      <View style={[styles.activityCard, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: "#D1FAE5" }]}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: theme.colors.text }]}>
              Completed electrical work for Raj Kumar
            </Text>
            <Text style={[styles.activityTime, { color: theme.colors.textLight }]}>2 hours ago</Text>
          </View>
          <Text style={[styles.activityAmount, { color: "#10B981" }]}>+₹1,500</Text>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: "#E0E7FF" }]}>
            <Ionicons name="calendar" size={16} color="#6366F1" />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: theme.colors.text }]}>New booking from Sarah Wilson</Text>
            <Text style={[styles.activityTime, { color: theme.colors.textLight }]}>4 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="star" size={16} color="#F59E0B" />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: theme.colors.text }]}>Received 5-star rating from Priya</Text>
            <Text style={[styles.activityTime, { color: theme.colors.textLight }]}>6 hours ago</Text>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader />
        <NextJobCard />
        <QuickActionsGrid />
        <TodayStatsCard />
        <UpcomingJobsSection />
        <RecentActivitySection />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.colors.backgroundLight }]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <View style={[styles.navIconActive, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="home" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.navLabelActive, { color: theme.colors.primary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="briefcase-outline" size={20} color={theme.colors.textLight} />
          <Text style={[styles.navLabel, { color: theme.colors.textLight }]}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="wallet-outline" size={20} color={theme.colors.textLight} />
          <Text style={[styles.navLabel, { color: theme.colors.textLight }]}>Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textLight} />
          <Text style={[styles.navLabel, { color: theme.colors.textLight }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header Styles
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },

  // Availability Section Styles
  availabilitySection: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 16,
    padding: 16,
  },
  availabilityContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  availabilityInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  availabilityToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    position: "relative",
  },
  toggleSlider: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    position: "absolute",
  },
  availabilityNote: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },

  // Section Styles
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Next Job Styles
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextJobTime: {
    fontSize: 12,
    fontWeight: "600",
  },
  nextJobCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  priorityStrip: {
    height: 4,
    width: "100%",
  },
  priorityIndicator: {
    height: "100%",
    width: "100%",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 16,
  },
  clientSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  jobMetaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  jobPriceSection: {
    alignItems: "flex-end",
  },
  jobPrice: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  // Job Actions Styles (Updated)
  jobActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  navigationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // Quick Actions Styles
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 16,
  },
  quickActionCard: {
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionAmount: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Stats Styles
  statsCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  progressSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },

  // Upcoming Jobs Styles
  upcomingJobsList: {
    paddingHorizontal: 24,
  },
  upcomingJobCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  upcomingJobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  upcomingClientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  upcomingPriorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  upcomingJobTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  upcomingClientName: {
    fontSize: 12,
    marginBottom: 12,
  },
  upcomingJobMeta: {
    gap: 6,
    marginBottom: 12,
  },
  upcomingMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  upcomingMetaText: {
    fontSize: 11,
  },
  upcomingJobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upcomingJobPrice: {
    fontSize: 14,
    fontWeight: "600",
  },
  upcomingStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  upcomingStatusText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
  },

  // Activity Styles
  activityCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navIconActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: "600",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
  },
})

export default EmployeeHomeScreen
