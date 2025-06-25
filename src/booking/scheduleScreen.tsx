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
  Modal,
  Dimensions,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

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

interface ScheduledBooking {
  id: string
  workerId: string
  workerName: string
  workerCategory: string
  workerRating: number
  workerImage: any
  workerPhone: string
  serviceDetails: string
  price: number
  paymentMode: "Cash" | "Card" | "UPI" | "Wallet"
  status: "Confirmed" | "Pending" | "In Progress" | "Completed" | "Cancelled"
  scheduledDate: Date
  duration: number
  location: {
    address: string
    coordinates: { latitude: number; longitude: number }
  }
  notes?: string
  reminderSet: boolean
}

const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedBooking, setSelectedBooking] = useState<ScheduledBooking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const scheduledBookings: ScheduledBooking[] = [
    {
      id: "SCH001",
      workerId: "1",
      workerName: "Rajesh Kumar",
      workerCategory: "Electrician",
      workerRating: 4.8,
      workerImage: workerImage,
      workerPhone: "+91 98765 43210",
      serviceDetails: "AC installation and electrical setup",
      price: 750,
      paymentMode: "UPI",
      status: "Confirmed",
      scheduledDate: new Date("2024-01-25T10:00:00"),
      duration: 3,
      location: {
        address: "Connaught Place, New Delhi",
        coordinates: { latitude: 28.6139, longitude: 77.209 },
      },
      notes: "Please bring ladder and necessary tools",
      reminderSet: true,
    },
    {
      id: "SCH002",
      workerId: "2",
      workerName: "Amit Singh",
      workerCategory: "Plumber",
      workerRating: 4.6,
      workerImage: workerImage,
      workerPhone: "+91 98765 43211",
      serviceDetails: "Bathroom pipe repair and fixture installation",
      price: 450,
      paymentMode: "Cash",
      status: "Confirmed",
      scheduledDate: new Date("2024-01-26T14:30:00"),
      duration: 2,
      location: {
        address: "Karol Bagh, New Delhi",
        coordinates: { latitude: 28.6519, longitude: 77.1909 },
      },
      reminderSet: true,
    },
    {
      id: "SCH003",
      workerId: "3",
      workerName: "Manoj Gupta",
      workerCategory: "Painter",
      workerRating: 4.5,
      workerImage: workerImage,
      workerPhone: "+91 98765 43214",
      serviceDetails: "Living room wall painting",
      price: 1200,
      paymentMode: "Card",
      status: "Pending",
      scheduledDate: new Date("2024-01-28T09:00:00"),
      duration: 6,
      location: {
        address: "Lajpat Nagar, New Delhi",
        coordinates: { latitude: 28.5665, longitude: 77.2431 },
      },
      notes: "Customer will provide paint materials",
      reminderSet: false,
    },
    {
      id: "SCH004",
      workerId: "4",
      workerName: "Suresh Yadav",
      workerCategory: "Electrician",
      workerRating: 4.9,
      workerImage: workerImage,
      workerPhone: "+91 98765 43212",
      serviceDetails: "Kitchen electrical wiring upgrade",
      price: 850,
      paymentMode: "UPI",
      status: "In Progress",
      scheduledDate: new Date("2024-01-24T11:00:00"),
      duration: 4,
      location: {
        address: "Rohini, New Delhi",
        coordinates: { latitude: 28.7041, longitude: 77.1025 },
      },
      reminderSet: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return theme.success
      case "Pending":
        return theme.warning
      case "In Progress":
        return theme.accent
      case "Completed":
        return theme.success
      case "Cancelled":
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getBookingsForDate = (date: Date) => {
    return scheduledBookings.filter((booking) => {
      const bookingDate = new Date(booking.scheduledDate)
      return bookingDate.toDateString() === date.toDateString()
    })
  }

  const getTodaysBookings = () => {
    const today = new Date()
    return scheduledBookings.filter((booking) => {
      const bookingDate = new Date(booking.scheduledDate)
      return bookingDate.toDateString() === today.toDateString()
    })
  }

  const getUpcomingBookings = () => {
    const today = new Date()
    return scheduledBookings
      .filter((booking) => new Date(booking.scheduledDate) >= today)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5)
  }

  const CalendarDay = ({
    date,
    isSelected,
    hasBookings,
  }: { date: Date | null; isSelected: boolean; hasBookings: boolean }) => {
    const scaleAnim = useSharedValue(1)

    const handlePress = () => {
      if (!date) return
      scaleAnim.value = withSpring(0.9, { damping: 15 }, () => {
        scaleAnim.value = withSpring(1, { damping: 15 })
      })
      setSelectedDate(date)
    }

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }))

    if (!date) {
      return <View style={styles.emptyDay} />
    }

    const isToday = date.toDateString() === new Date().toDateString()

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View
          style={[styles.calendarDay, isSelected && styles.selectedDay, isToday && styles.todayDay, animatedStyle]}
        >
          <Text style={[styles.dayText, isSelected && styles.selectedDayText, isToday && styles.todayText]}>
            {date.getDate()}
          </Text>
          {hasBookings && <View style={[styles.bookingDot, isSelected && styles.selectedBookingDot]} />}
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const BookingCard = ({
    booking,
    index,
    compact = false,
  }: { booking: ScheduledBooking; index: number; compact?: boolean }) => {
    const fadeAnim = useSharedValue(0)
    const slideAnim = useSharedValue(30)

    useEffect(() => {
      fadeAnim.value = withDelay(index * 100, withTiming(1, { duration: 600 }))
      slideAnim.value = withDelay(index * 100, withSpring(0, { damping: 20, stiffness: 90 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    }))

    const handlePress = () => {
      setSelectedBooking(booking)
      setShowDetailsModal(true)
    }

    return (
      <Animated.View style={[compact ? styles.compactBookingCard : styles.bookingCard, animatedStyle]}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.95}>
          <View style={styles.cardHeader}>
            <View style={styles.timeSection}>
              <Text style={styles.timeText}>{formatTime(booking.scheduledDate)}</Text>
              <Text style={styles.durationText}>{booking.duration}h</Text>
            </View>
            <View style={styles.workerSection}>
              <Image source={booking.workerImage} style={compact ? styles.compactAvatar : styles.workerAvatar} />
              <View style={styles.workerInfo}>
                <Text style={compact ? styles.compactWorkerName : styles.workerName}>{booking.workerName}</Text>
                <Text style={compact ? styles.compactWorkerCategory : styles.workerCategory}>
                  {booking.workerCategory}
                </Text>
                {!compact && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color={theme.warning} />
                    <Text style={styles.ratingText}>{booking.workerRating}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.statusSection}>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(booking.status)}15` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>{booking.status}</Text>
              </View>
              <Text style={styles.priceText}>₹{booking.price}</Text>
            </View>
          </View>

          {!compact && (
            <>
              <View style={styles.serviceSection}>
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {booking.serviceDetails}
                </Text>
              </View>

              <View style={styles.locationSection}>
                <Ionicons name="location-outline" size={16} color={theme.accent} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {booking.location.address}
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const modalFade = useSharedValue(0)
  const modalSlide = useSharedValue(height)

  useEffect(() => {
    if (showDetailsModal) {
      modalFade.value = withTiming(1, { duration: 300 })
      modalSlide.value = withSpring(0, { damping: 25, stiffness: 120 })
    } else {
      modalFade.value = withTiming(0, { duration: 200 })
      modalSlide.value = withTiming(height, { duration: 200 })
    }
  }, [showDetailsModal])

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalFade.value,
    transform: [{ translateY: modalSlide.value }],
  }))

  const BookingDetailsModal = () => {
    if (!selectedBooking) return null

    return (
      <Modal visible={showDetailsModal} animationType="none" transparent>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <TouchableOpacity onPress={() => setShowDetailsModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Booking Header */}
              <View style={styles.modalBookingHeader}>
                <View style={styles.modalTimeContainer}>
                  <Text style={styles.modalDate}>{formatDate(selectedBooking.scheduledDate)}</Text>
                  <Text style={styles.modalTime}>{formatTime(selectedBooking.scheduledDate)}</Text>
                  <Text style={styles.modalDuration}>{selectedBooking.duration} hours</Text>
                </View>
                <View
                  style={[styles.modalStatusBadge, { backgroundColor: `${getStatusColor(selectedBooking.status)}20` }]}
                >
                  <Text style={[styles.modalStatusText, { color: getStatusColor(selectedBooking.status) }]}>
                    {selectedBooking.status}
                  </Text>
                </View>
              </View>

              {/* Worker Card */}
              <View style={styles.modalWorkerCard}>
                <Image source={selectedBooking.workerImage} style={styles.modalWorkerAvatar} />
                <View style={styles.modalWorkerInfo}>
                  <Text style={styles.modalWorkerName}>{selectedBooking.workerName}</Text>
                  <Text style={styles.modalWorkerCategory}>{selectedBooking.workerCategory}</Text>
                  <View style={styles.modalRatingContainer}>
                    <Ionicons name="star" size={16} color={theme.warning} />
                    <Text style={styles.modalRatingText}>{selectedBooking.workerRating}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Ionicons name="call" size={20} color={theme.background} />
                </TouchableOpacity>
              </View>

              {/* Service Details */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Service Details</Text>
                <View style={styles.modalServiceCard}>
                  <Text style={styles.modalServiceText}>{selectedBooking.serviceDetails}</Text>
                  <View style={styles.modalServiceMeta}>
                    <View style={styles.modalMetaItem}>
                      <Ionicons name="cash-outline" size={18} color={theme.accent} />
                      <Text style={styles.modalMetaText}>
                        ₹{selectedBooking.price} via {selectedBooking.paymentMode}
                      </Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Ionicons name="location-outline" size={18} color={theme.accent} />
                      <Text style={styles.modalMetaText}>{selectedBooking.location.address}</Text>
                    </View>
                    {selectedBooking.notes && (
                      <View style={styles.modalMetaItem}>
                        <Ionicons name="document-text-outline" size={18} color={theme.accent} />
                        <Text style={styles.modalMetaText}>{selectedBooking.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.primaryAction}>
                  <Ionicons name="chatbubble-outline" size={20} color={theme.background} />
                  <Text style={styles.primaryActionText}>Message Worker</Text>
                </TouchableOpacity>
                <View style={styles.secondaryActions}>
                  <TouchableOpacity style={styles.secondaryAction}>
                    <Ionicons name="calendar-outline" size={20} color={theme.accent} />
                    <Text style={styles.secondaryActionText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryAction}>
                    <Ionicons name="close-outline" size={20} color={theme.error} />
                    <Text style={[styles.secondaryActionText, { color: theme.error }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    )
  }

  const renderCalendarView = () => {
    const days = getDaysInMonth(selectedDate)
    const selectedDateBookings = getBookingsForDate(selectedDate)

    return (
      <View style={styles.calendarContainer}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
            style={styles.navButton}
          >
            <Ionicons name="chevron-back" size={24} color={theme.accent} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {selectedDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            style={styles.navButton}
          >
            <Ionicons name="chevron-forward" size={24} color={theme.accent} />
          </TouchableOpacity>
        </View>

        {/* Days of Week */}
        <View style={styles.daysOfWeek}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={styles.dayOfWeekText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((date, index) => (
            <CalendarDay
              key={index}
              date={date}
              isSelected={date?.toDateString() === selectedDate.toDateString()}
              hasBookings={date ? getBookingsForDate(date).length > 0 : false}
            />
          ))}
        </View>

        {/* Selected Date Bookings */}
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            {selectedDate.toDateString() === new Date().toDateString()
              ? "Today's Schedule"
              : `Schedule for ${formatDate(selectedDate)}`}
          </Text>
          {selectedDateBookings.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedDateBookings.map((booking, index) => (
                <BookingCard key={booking.id} booking={booking} index={index} compact />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptySchedule}>
              <Ionicons name="calendar-outline" size={48} color={theme.textTertiary} />
              <Text style={styles.emptyScheduleText}>No bookings scheduled</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderListView = () => {
    const upcomingBookings = getUpcomingBookings()

    return (
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {/* Today's Bookings */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today</Text>
          {getTodaysBookings().length > 0 ? (
            getTodaysBookings().map((booking, index) => (
              <BookingCard key={booking.id} booking={booking} index={index} />
            ))
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>No bookings today</Text>
            </View>
          )}
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking, index) => <BookingCard key={booking.id} booking={booking} index={index} />)
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>No upcoming bookings</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
          <Text style={styles.headerTitle}>My Schedule</Text>
          <Text style={styles.headerSubtitle}>{scheduledBookings.length} bookings scheduled</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={theme.accent} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === "calendar" && styles.activeToggle]}
          onPress={() => setViewMode("calendar")}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={viewMode === "calendar" ? theme.background : theme.textSecondary}
          />
          <Text style={[styles.toggleText, viewMode === "calendar" && styles.activeToggleText]}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === "list" && styles.activeToggle]}
          onPress={() => setViewMode("list")}
        >
          <Ionicons
            name="list-outline"
            size={20}
            color={viewMode === "list" ? theme.background : theme.textSecondary}
          />
          <Text style={[styles.toggleText, viewMode === "list" && styles.activeToggleText]}>List</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === "calendar" ? renderCalendarView() : renderListView()}

      <BookingDetailsModal />
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
  addButton: {
    padding: 8,
    backgroundColor: theme.surface,
    borderRadius: 8,
  },
  viewToggle: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeToggle: {
    backgroundColor: theme.accent,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textSecondary,
  },
  activeToggleText: {
    color: theme.background,
  },
  // Calendar View Styles
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
  },
  daysOfWeek: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: theme.textSecondary,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  calendarDay: {
    width: width / 7 - 20 / 7,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderRadius: 8,
    position: "relative",
  },
  selectedDay: {
    backgroundColor: theme.accent,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  todayDay: {
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.accent,
  },
  emptyDay: {
    width: width / 7 - 20 / 7,
    height: 44,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.text,
  },
  selectedDayText: {
    color: theme.background,
    fontWeight: "600",
  },
  todayText: {
    color: theme.accent,
    fontWeight: "600",
  },
  bookingDot: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.accent,
  },
  selectedBookingDot: {
    backgroundColor: theme.background,
  },
  selectedDateSection: {
    flex: 1,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 16,
  },
  emptySchedule: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyScheduleText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 12,
  },
  // List View Styles
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  todaySection: {
    marginBottom: 32,
  },
  upcomingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.text,
    marginBottom: 16,
  },
  emptySection: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: theme.surface,
    borderRadius: 16,
  },
  emptySectionText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  // Booking Card Styles
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
  compactBookingCard: {
    backgroundColor: theme.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeSection: {
    alignItems: "center",
    marginRight: 16,
    minWidth: 60,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.accent,
  },
  durationText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  workerSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  workerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    marginRight: 12,
  },
  compactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 12,
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
  compactWorkerName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 2,
  },
  workerCategory: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  compactWorkerCategory: {
    fontSize: 12,
    color: theme.textSecondary,
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
  statusSection: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.text,
  },
  serviceSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  serviceDescription: {
    fontSize: 15,
    color: theme.text,
    lineHeight: 22,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: "relative",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalBookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTimeContainer: {
    flex: 1,
  },
  modalDate: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 4,
  },
  modalTime: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.accent,
    marginBottom: 4,
  },
  modalDuration: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  modalStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalWorkerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  modalWorkerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 16,
  },
  modalWorkerInfo: {
    flex: 1,
  },
  modalWorkerName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 4,
  },
  modalWorkerCategory: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 6,
  },
  modalRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalRatingText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 4,
  },
  callButton: {
    backgroundColor: theme.success,
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 12,
  },
  modalServiceCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
  },
  modalServiceText: {
    fontSize: 15,
    color: theme.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  modalServiceMeta: {
    gap: 12,
  },
  modalMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalMetaText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  modalActions: {
    paddingBottom: 24,
  },
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.accent,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 12,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.background,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.accent,
  },
})

export default ScheduleScreen
