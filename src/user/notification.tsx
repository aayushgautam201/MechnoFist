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
  Switch,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated"
import { useTheme } from "../contexts/themeContext"

const { width, height } = Dimensions.get("window")

const workerImage = require("../images/man.jpg")

interface Notification {
  id: string
  type: "booking" | "payment" | "worker" | "system" | "promotion" | "reminder"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high"
  actionRequired?: boolean
  relatedId?: string
  image?: any
  data?: {
    bookingId?: string
    workerId?: string
    amount?: number
    workerName?: string
    serviceType?: string
  }
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme, isDark } = useTheme()
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "important">("all")
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationSettings, setNotificationSettings] = useState({
    bookingUpdates: true,
    paymentAlerts: true,
    workerMessages: true,
    promotions: false,
    systemUpdates: true,
    reminders: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
  })

  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "booking",
      title: "Booking Confirmed",
      message: "Your booking with Rajesh Kumar has been confirmed for tomorrow at 10:00 AM",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      priority: "high",
      actionRequired: false,
      image: workerImage,
      data: {
        bookingId: "BK001",
        workerId: "1",
        workerName: "Rajesh Kumar",
        serviceType: "Electrical Work",
      },
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Successful",
      message: "Payment of ₹750 has been processed successfully for your recent booking",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      priority: "medium",
      actionRequired: false,
      data: {
        amount: 750,
        bookingId: "BK002",
      },
    },
    {
      id: "3",
      type: "worker",
      title: "Worker is on the way",
      message: "Amit Singh has started traveling to your location. ETA: 15 minutes",
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      read: true,
      priority: "high",
      actionRequired: false,
      image: workerImage,
      data: {
        workerId: "2",
        workerName: "Amit Singh",
        bookingId: "BK003",
      },
    },
    {
      id: "4",
      type: "reminder",
      title: "Upcoming Booking Reminder",
      message: "You have a scheduled appointment with Suresh Yadav tomorrow at 2:00 PM",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      priority: "medium",
      actionRequired: false,
      image: workerImage,
      data: {
        workerId: "3",
        workerName: "Suresh Yadav",
        bookingId: "BK004",
      },
    },
    {
      id: "5",
      type: "promotion",
      title: "Special Offer - 20% Off",
      message: "Get 20% off on your next electrical service booking. Valid until this weekend!",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      priority: "low",
      actionRequired: false,
    },
    {
      id: "6",
      type: "system",
      title: "App Update Available",
      message: "A new version of the app is available with improved features and bug fixes",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      priority: "low",
      actionRequired: true,
    },
    {
      id: "7",
      type: "booking",
      title: "Booking Cancelled",
      message: "Your booking scheduled for today has been cancelled by the worker due to emergency",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      read: false,
      priority: "high",
      actionRequired: true,
      data: {
        bookingId: "BK005",
        workerName: "Manoj Gupta",
      },
    },
    {
      id: "8",
      type: "worker",
      title: "New Message",
      message: "Rajesh Kumar sent you a message about your upcoming appointment",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: "medium",
      actionRequired: false,
      image: workerImage,
      data: {
        workerId: "1",
        workerName: "Rajesh Kumar",
      },
    },
  ]

  useEffect(() => {
    setNotifications(mockNotifications)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "calendar"
      case "payment":
        return "card"
      case "worker":
        return "person"
      case "system":
        return "settings"
      case "promotion":
        return "gift"
      case "reminder":
        return "alarm"
      default:
        return "notifications"
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "high") return theme.colors.error
    switch (type) {
      case "booking":
        return theme.colors.primary
      case "payment":
        return theme.colors.success
      case "worker":
        return theme.colors.blue
      case "system":
        return theme.colors.textLight
      case "promotion":
        return theme.colors.warning
      case "reminder":
        return theme.colors.secondary
      default:
        return theme.colors.primary
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const filteredNotifications = notifications.filter((notification) => {
    switch (selectedFilter) {
      case "unread":
        return !notification.read
      case "important":
        return notification.priority === "high" || notification.actionRequired
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const NotificationCard = ({ notification, index }: { notification: Notification; index: number }) => {
    const fadeAnim = useSharedValue(0)
    const slideAnim = useSharedValue(50)
    const scaleAnim = useSharedValue(0.95)

    useEffect(() => {
      fadeAnim.value = withDelay(index * 100, withTiming(1, { duration: 600 }))
      slideAnim.value = withDelay(index * 100, withSpring(0, { damping: 20, stiffness: 90 }))
      scaleAnim.value = withDelay(index * 100, withSpring(1, { damping: 20, stiffness: 90 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }, { scale: scaleAnim.value }],
    }))

    const handlePress = () => {
      if (!notification.read) {
        markAsRead(notification.id)
      }
      // Handle navigation based on notification type
      // navigation.navigate('BookingDetails', { id: notification.data?.bookingId })
    }

    const handleDelete = () => {
      deleteNotification(notification.id)
    }

    return (
      <Animated.View
        style={[styles.notificationCard, { backgroundColor: theme.colors.backgroundLight }, animatedStyle]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.95} style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIconContainer}>
              {notification.image ? (
                <Image source={notification.image} style={styles.notificationImage} />
              ) : (
                <View
                  style={[
                    styles.notificationIcon,
                    { backgroundColor: `${getNotificationColor(notification.type, notification.priority)}20` },
                  ]}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type, notification.priority)}
                  />
                </View>
              )}
              {!notification.read && <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />}
            </View>

            <View style={styles.notificationBody}>
              <View style={styles.notificationTitleRow}>
                <Text style={[styles.notificationTitle, { color: theme.colors.text }]} numberOfLines={1}>
                  {notification.title}
                </Text>
                <Text style={[styles.notificationTime, { color: theme.colors.textLighter }]}>
                  {formatTimestamp(notification.timestamp)}
                </Text>
              </View>
              <Text style={[styles.notificationMessage, { color: theme.colors.textLight }]} numberOfLines={2}>
                {notification.message}
              </Text>
              {notification.actionRequired && (
                <View style={[styles.actionRequiredBadge, { backgroundColor: theme.colors.warning }]}>
                  <Text style={styles.actionRequiredText}>Action Required</Text>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="close" size={18} color={theme.colors.textLighter} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const FilterChip = ({ title, isSelected, count }: { title: string; isSelected: boolean; count?: number }) => {
    const scaleAnim = useSharedValue(1)

    const handlePress = () => {
      scaleAnim.value = withSpring(0.95, { damping: 15 }, () => {
        scaleAnim.value = withSpring(1, { damping: 15 })
      })
      setSelectedFilter(title.toLowerCase() as any)
    }

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }))

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.filterChip,
            {
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.backgroundSoft,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            },
            animatedStyle,
          ]}
        >
          <Text style={[styles.filterText, { color: isSelected ? theme.colors.background : theme.colors.textLight }]}>
            {title}
          </Text>
          {count !== undefined && count > 0 && (
            <View
              style={[
                styles.filterBadge,
                {
                  backgroundColor: isSelected ? theme.colors.background : theme.colors.primary,
                },
              ]}
            >
              <Text
                style={[styles.filterBadgeText, { color: isSelected ? theme.colors.primary : theme.colors.background }]}
              >
                {count}
              </Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const SettingsModal = () => {
    const modalFade = useSharedValue(0)
    const modalSlide = useSharedValue(height)

    useEffect(() => {
      if (showSettingsModal) {
        modalFade.value = withTiming(1, { duration: 300 })
        modalSlide.value = withSpring(0, { damping: 25, stiffness: 120 })
      } else {
        modalFade.value = withTiming(0, { duration: 200 })
        modalSlide.value = withTiming(height, { duration: 200 })
      }
    }, [showSettingsModal])

    const animatedModalStyle = useAnimatedStyle(() => ({
      opacity: modalFade.value,
      transform: [{ translateY: modalSlide.value }],
    }))

    const SettingItem = ({
      title,
      description,
      value,
      onToggle,
    }: {
      title: string
      description: string
      value: boolean
      onToggle: () => void
    }) => (
      <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: theme.colors.textLight }]}>{description}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.primarySoft }}
          thumbColor={value ? theme.colors.primary : theme.colors.textLighter}
        />
      </View>
    )

    return (
      <Modal visible={showSettingsModal} animationType="none" transparent>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContainer, { backgroundColor: theme.colors.background }, animatedModalStyle]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <View style={[styles.modalHandle, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Notification Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.settingsSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notification Types</Text>
                <SettingItem
                  title="Booking Updates"
                  description="Get notified about booking confirmations, changes, and cancellations"
                  value={notificationSettings.bookingUpdates}
                  onToggle={() =>
                    setNotificationSettings((prev) => ({ ...prev, bookingUpdates: !prev.bookingUpdates }))
                  }
                />
                <SettingItem
                  title="Payment Alerts"
                  description="Receive notifications for payment confirmations and failures"
                  value={notificationSettings.paymentAlerts}
                  onToggle={() => setNotificationSettings((prev) => ({ ...prev, paymentAlerts: !prev.paymentAlerts }))}
                />
                <SettingItem
                  title="Worker Messages"
                  description="Get notified when workers send you messages"
                  value={notificationSettings.workerMessages}
                  onToggle={() =>
                    setNotificationSettings((prev) => ({ ...prev, workerMessages: !prev.workerMessages }))
                  }
                />
                <SettingItem
                  title="Promotions & Offers"
                  description="Receive notifications about special offers and discounts"
                  value={notificationSettings.promotions}
                  onToggle={() => setNotificationSettings((prev) => ({ ...prev, promotions: !prev.promotions }))}
                />
                <SettingItem
                  title="System Updates"
                  description="Get notified about app updates and system maintenance"
                  value={notificationSettings.systemUpdates}
                  onToggle={() => setNotificationSettings((prev) => ({ ...prev, systemUpdates: !prev.systemUpdates }))}
                />
                <SettingItem
                  title="Reminders"
                  description="Receive reminders about upcoming bookings and appointments"
                  value={notificationSettings.reminders}
                  onToggle={() => setNotificationSettings((prev) => ({ ...prev, reminders: !prev.reminders }))}
                />
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Delivery Methods</Text>
                <SettingItem
                  title="Push Notifications"
                  description="Receive notifications directly on your device"
                  value={notificationSettings.pushNotifications}
                  onToggle={() =>
                    setNotificationSettings((prev) => ({ ...prev, pushNotifications: !prev.pushNotifications }))
                  }
                />
                <SettingItem
                  title="Email Notifications"
                  description="Get notifications via email"
                  value={notificationSettings.emailNotifications}
                  onToggle={() =>
                    setNotificationSettings((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))
                  }
                />
                <SettingItem
                  title="SMS Notifications"
                  description="Receive important notifications via SMS"
                  value={notificationSettings.smsNotifications}
                  onToggle={() =>
                    setNotificationSettings((prev) => ({ ...prev, smsNotifications: !prev.smsNotifications }))
                  }
                />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Notifications</Text>
          {/* {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )} */}
        </View>
        <View style={styles.headerActions}>
          {/* {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <Text style={[styles.markAllText, { color: theme.colors.primary }]}>Mark all read</Text>
            </TouchableOpacity>
          )} */}
          {/* <TouchableOpacity onPress={() => setShowSettingsModal(true)} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
                {/* {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <Text style={[styles.markAllText, { color: theme.colors.primary }]}>Mark all read</Text>
            </TouchableOpacity>
          )} */}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          <FilterChip title="All" isSelected={selectedFilter === "all"} />
          <FilterChip title="Unread" isSelected={selectedFilter === "unread"} count={unreadCount} />
          <FilterChip
            title="Important"
            isSelected={selectedFilter === "important"}
            count={notifications.filter((n) => n.priority === "high" || n.actionRequired).length}
          />
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <NotificationCard key={notification.id} notification={notification} index={index} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color={theme.colors.textLighter} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No notifications</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textLight }]}>
              {selectedFilter === "unread"
                ? "All caught up! No unread notifications."
                : selectedFilter === "important"
                  ? "No important notifications at the moment."
                  : "You'll see your notifications here when you receive them."}
            </Text>
          </View>
        )}
      </ScrollView>

      <SettingsModal />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  unreadBadge: {
    marginLeft: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  settingsButton: {
    padding: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  notificationsList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationCard: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIconContainer: {
    position: "relative",
    marginRight: 12,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  notificationBody: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionRequiredBadge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionRequiredText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
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
    borderBottomWidth: 1,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
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
  settingsSection: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
})

export default NotificationsScreen
