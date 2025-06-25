"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated"

const { width } = Dimensions.get("window")

// Original theme from booking screen
const theme = {
  primary: "#1A1A1A",
  accent: "#007AFF",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  background: "#FFFFFF",
  surface: "#F8F9FA",
  border: "#E9ECEF",
  text: "#1A1A1A",
  textSecondary: "#6C757D",
  textTertiary: "#ADB5BD",
  shadow: "rgba(0,0,0,0.08)",
}

const workerImage = require("../images/man.jpg")

interface Booking {
  id: string
  workerId: string
  workerName: string
  workerCategory: string
  workerRating: number
  workerImage: any
  workerPhone: string
  serviceDetails: string
  originalPrice: number
  finalPrice: number
  priceNegotiated: boolean
  paymentMode: "Cash" | "Card" | "UPI" | "Wallet"
  paymentStatus: "Paid" | "Pending" | "Failed"
  bookingStatus: "Completed" | "In Progress" | "Cancelled" | "Scheduled"
  bookingDate: Date
  serviceDate: Date
  duration: number
  location: {
    address: string
    coordinates: { latitude: number; longitude: number }
  }
  rating?: number
  review?: string
  totalAmount: number
  discount?: number
  taxes: number
}

const BookingHistoryScreen: React.FC = () => {
  const navigation = useNavigation()
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Completed" | "In Progress" | "Cancelled">("All")
  const [searchQuery, setSearchQuery] = useState("")

  const bookings: Booking[] = [
    {
      id: "BK001",
      workerId: "1",
      workerName: "Rajesh Kumar",
      workerCategory: "Electrician",
      workerRating: 4.8,
      workerImage: workerImage,
      workerPhone: "+91 98765 43210",
      serviceDetails: "Electrical wiring repair and socket installation",
      originalPrice: 500,
      finalPrice: 420,
      priceNegotiated: true,
      paymentMode: "UPI",
      paymentStatus: "Paid",
      bookingStatus: "Completed",
      bookingDate: new Date("2024-01-15T10:30:00"),
      serviceDate: new Date("2024-01-15T14:00:00"),
      duration: 2.5,
      location: {
        address: "Connaught Place, New Delhi",
        coordinates: { latitude: 28.6139, longitude: 77.209 },
      },
      rating: 5,
      review: "Excellent work! Very professional and completed on time.",
      totalAmount: 420,
      taxes: 42,
    },
    {
      id: "BK002",
      workerId: "2",
      workerName: "Amit Singh",
      workerCategory: "Plumber",
      workerRating: 4.6,
      workerImage: workerImage,
      workerPhone: "+91 98765 43211",
      serviceDetails: "Kitchen sink repair and pipe fixing",
      originalPrice: 350,
      finalPrice: 350,
      priceNegotiated: false,
      paymentMode: "Cash",
      paymentStatus: "Paid",
      bookingStatus: "Completed",
      bookingDate: new Date("2024-01-10T09:15:00"),
      serviceDate: new Date("2024-01-10T11:00:00"),
      duration: 1.5,
      location: {
        address: "Karol Bagh, New Delhi",
        coordinates: { latitude: 28.6519, longitude: 77.1909 },
      },
      rating: 4,
      review: "Good service, but took a bit longer than expected.",
      totalAmount: 350,
      taxes: 35,
    },
    {
      id: "BK003",
      workerId: "3",
      workerName: "Suresh Yadav",
      workerCategory: "Electrician",
      workerRating: 4.9,
      workerImage: workerImage,
      workerPhone: "+91 98765 43212",
      serviceDetails: "AC installation and electrical setup",
      originalPrice: 800,
      finalPrice: 750,
      priceNegotiated: true,
      paymentMode: "Card",
      paymentStatus: "Paid",
      bookingStatus: "In Progress",
      bookingDate: new Date("2024-01-20T08:00:00"),
      serviceDate: new Date("2024-01-20T10:00:00"),
      duration: 3,
      location: {
        address: "Lajpat Nagar, New Delhi",
        coordinates: { latitude: 28.5665, longitude: 77.2431 },
      },
      totalAmount: 750,
      taxes: 75,
    },
    {
      id: "BK004",
      workerId: "4",
      workerName: "Vikram Sharma",
      workerCategory: "Carpenter",
      workerRating: 4.7,
      workerImage: workerImage,
      workerPhone: "+91 98765 43213",
      serviceDetails: "Furniture repair and cabinet installation",
      originalPrice: 600,
      finalPrice: 600,
      priceNegotiated: false,
      paymentMode: "Wallet",
      paymentStatus: "Failed",
      bookingStatus: "Cancelled",
      bookingDate: new Date("2024-01-08T12:00:00"),
      serviceDate: new Date("2024-01-08T15:00:00"),
      duration: 2,
      location: {
        address: "Rohini, New Delhi",
        coordinates: { latitude: 28.7041, longitude: 77.1025 },
      },
      totalAmount: 600,
      taxes: 60,
    },
    {
      id: "BK005",
      workerId: "5",
      workerName: "Manoj Gupta",
      workerCategory: "Painter",
      workerRating: 4.5,
      workerImage: workerImage,
      workerPhone: "+91 98765 43214",
      serviceDetails: "Room painting and wall preparation",
      originalPrice: 1200,
      finalPrice: 1100,
      priceNegotiated: true,
      paymentMode: "UPI",
      paymentStatus: "Pending",
      bookingStatus: "Scheduled",
      bookingDate: new Date("2024-01-25T07:30:00"),
      serviceDate: new Date("2024-01-28T09:00:00"),
      duration: 6,
      location: {
        address: "Dwarka, New Delhi",
        coordinates: { latitude: 28.5921, longitude: 77.046 },
      },
      totalAmount: 1100,
      taxes: 110,
    },
  ]

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = selectedFilter === "All" || booking.bookingStatus === selectedFilter
    const matchesSearch =
      booking.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.workerCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return theme.success
      case "In Progress":
        return theme.accent
      case "Cancelled":
        return theme.error
      case "Scheduled":
        return theme.warning
      default:
        return theme.textSecondary
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return theme.success
      case "Pending":
        return theme.warning
      case "Failed":
        return theme.error
      default:
        return theme.textSecondary
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const BookingCard = ({ booking, index }: { booking: Booking; index: number }) => {
    const fadeAnim = useSharedValue(0)
    const slideAnim = useSharedValue(50)
    const scaleAnim = useSharedValue(0.9)

    useEffect(() => {
      fadeAnim.value = withDelay(index * 150, withTiming(1, { duration: 800 }))
      slideAnim.value = withDelay(index * 150, withSpring(0, { damping: 20, stiffness: 90 }))
      scaleAnim.value = withDelay(index * 150, withSpring(1, { damping: 20, stiffness: 90 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }, { scale: scaleAnim.value }],
    }))

    return (
      <Animated.View style={[styles.bookingCard, animatedStyle]}>
        <TouchableOpacity activeOpacity={0.95} onPress={() => navigation.navigate("BookingDetailScreen")}>
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.workerSection}>
              <View style={styles.avatarContainer}>
                <Image source={booking.workerImage} style={styles.workerAvatar} />
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(booking.bookingStatus) }]} />
              </View>
              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{booking.workerName}</Text>
                <Text style={styles.workerCategory}>{booking.workerCategory}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={theme.warning} />
                  <Text style={styles.ratingText}>{booking.workerRating}</Text>
                  <Text style={styles.completedJobs}>• 150+ jobs</Text>
                </View>
              </View>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.finalPrice}>₹{booking.finalPrice}</Text>
              {booking.priceNegotiated && <Text style={styles.originalPrice}>₹{booking.originalPrice}</Text>}
            </View>
          </View>

          {/* Service Description */}
          <View style={styles.serviceSection}>
            <Text style={styles.serviceDescription} numberOfLines={2}>
              {booking.serviceDetails}
            </Text>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={16 }color={theme.accent} />
              </View>
              <Text style={styles.detailText}>{formatDate(booking.serviceDate)}</Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={16} color={theme.accent} />
              </View>
              <Text style={styles.detailText}>{formatTime(booking.serviceDate)}</Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={16} color={theme.accent} />
              </View>
              <Text style={styles.detailText} numberOfLines={1}>
                {booking.location.address.split(",")[0]}
              </Text>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.cardFooter}>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(booking.bookingStatus)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(booking.bookingStatus) }]}>
                {booking.bookingStatus}
              </Text>
            </View>
            <View style={styles.paymentSection}>
              <Text style={styles.paymentMode}>{booking.paymentMode}</Text>
              <View style={[styles.paymentDot, { backgroundColor: getPaymentStatusColor(booking.paymentStatus) }]} />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const FilterChip = ({ title, isSelected }: { title: string; isSelected: boolean }) => {
    const scaleAnim = useSharedValue(1)

    const handlePress = () => {
      scaleAnim.value = withSpring(0.95, { damping: 15 }, () => {
        scaleAnim.value = withSpring(1, { damping: 15 })
      })
      setSelectedFilter(title as any)
    }

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }))

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View style={[styles.filterChip, isSelected && styles.selectedFilterChip, animatedStyle]}>
          <Text style={[styles.filterText, isSelected && styles.selectedFilterText]}>{title}</Text>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          {/* <Text style={styles.headerSubtitle}>{bookings.length}</Text> */}
        </View>
        <View style={styles.headerRight} />
      </SafeAreaView>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          <FilterChip title="All" isSelected={selectedFilter === "All"} />
          <FilterChip title="Completed" isSelected={selectedFilter === "Completed"} />
          <FilterChip title="In Progress" isSelected={selectedFilter === "In Progress"} />
          <FilterChip title="Cancelled" isSelected={selectedFilter === "Cancelled"} />
        </ScrollView>
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => <BookingCard key={booking.id} booking={booking} index={index} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.textTertiary} />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? "Try adjusting your search terms" : "Your booking history will appear here"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.background,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  bookingsList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: theme.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  workerSection: {
    flexDirection: "row",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  workerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
  },
  statusDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: theme.background,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 2,
  },
  workerCategory: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: theme.textSecondary,
    marginLeft: 4,
  },
  completedJobs: {
    fontSize: 13,
    color: theme.textTertiary,
    marginLeft: 4,
  },
  priceSection: {
    alignItems: "flex-end",
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.text,
  },
  originalPrice: {
    fontSize: 14,
    color: theme.textTertiary,
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  serviceSection: {
    marginBottom: 16,
  },
  serviceDescription: {
    fontSize: 15,
    color: theme.text,
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  paymentSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMode: {
    fontSize: 13,
    color: theme.textSecondary,
    marginRight: 8,
  },
  paymentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedFilterChip: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textSecondary,
  },
  selectedFilterText: {
    color: theme.background,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
})

export default BookingHistoryScreen