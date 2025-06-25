"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
  Linking,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated"
import { useTheme } from "../contexts/themeContext"

const { width, height } = Dimensions.get("window")

const workerImage = require("../images/man.jpg")

interface BookingStatus {
  current: "confirmed" | "worker_assigned" | "on_the_way" | "in_progress" | "completed" | "cancelled"
  timeline: {
    id: string
    status: string
    title: string
    description: string
    timestamp: Date
    completed: boolean
    icon: string
  }[]
}

interface BookingDetail {
  id: string
  bookingNumber: string
  status: BookingStatus
  services: {
    id: string
    name: string
    description: string
    price: number
    duration: number
    completed: boolean
  }[]
  worker: {
    id: string
    name: string
    profession: string
    rating: number
    reviewCount: number
    profileImage: any
    phone: string
    location: {
      latitude: number
      longitude: number
    }
    estimatedArrival?: string
    verified: boolean
  }
  customer: {
    name: string
    phone: string
    address: string
  }
  scheduling: {
    date: Date
    timeSlot: string
    duration: number
    urgency: "normal" | "urgent" | "emergency"
  }
  location: {
    address: string
    coordinates: { latitude: number; longitude: number }
    instructions?: string
  }
  pricing: {
    serviceTotal: number
    urgencyFee: number
    platformFee: number
    taxes: number
    discount: number
    total: number
    paid: number
    paymentMethod: string
    paymentStatus: "paid" | "pending" | "failed"
  }
  communication: {
    chatEnabled: boolean
    callEnabled: boolean
    lastMessage?: {
      text: string
      timestamp: Date
      sender: "customer" | "worker"
    }
  }
  rating?: {
    score: number
    review: string
    timestamp: Date
  }
  photos?: {
    before: string[]
    after: string[]
    progress: string[]
  }
  invoice?: {
    number: string
    downloadUrl: string
  }
  cancellation?: {
    reason: string
    timestamp: Date
    refundAmount: number
    refundStatus: "pending" | "processed"
  }
  recurring?: {
    enabled: boolean
    frequency: string
    nextBooking?: Date
  }
}

const BookingDetailScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme, isDark } = useTheme()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [workerLocation, setWorkerLocation] = useState({
    latitude: 28.6129,
    longitude: 77.209,
    heading: 45,
    speed: 25, // km/h
  })
  const [distanceToCustomer, setDistanceToCustomer] = useState(2.3) // km
  const [estimatedArrival, setEstimatedArrival] = useState(8) // minutes
  const [isLocationSharing, setIsLocationSharing] = useState(true)
  const locationUpdateInterval = useRef<NodeJS.Timeout | null>(null)
  const locationAnim = useSharedValue(0)

  useEffect(() => {
    locationAnim.value = withDelay(600, withSpring(1, { damping: 20, stiffness: 90 }))
  }, [])

  // Mock booking data (would come from API/navigation params)
  const booking: BookingDetail = {
    id: "BK001",
    bookingNumber: "BK240125001",
    status: {
      current: "in_progress",
      timeline: [
        {
          id: "1",
          status: "confirmed",
          title: "Booking Confirmed",
          description: "Your service booking has been confirmed",
          timestamp: new Date("2024-01-25T08:00:00"),
          completed: true,
          icon: "checkmark-circle",
        },
        {
          id: "2",
          status: "worker_assigned",
          title: "Professional Assigned",
          description: "Rajesh Kumar has been assigned to your service",
          timestamp: new Date("2024-01-25T08:15:00"),
          completed: true,
          icon: "person",
        },
        {
          id: "3",
          status: "on_the_way",
          title: "On The Way",
          description: "Professional is traveling to your location",
          timestamp: new Date("2024-01-25T09:30:00"),
          completed: true,
          icon: "car",
        },
        {
          id: "4",
          status: "in_progress",
          title: "Service In Progress",
          description: "Work has started at your location",
          timestamp: new Date("2024-01-25T10:00:00"),
          completed: true,
          icon: "construct",
        },
        {
          id: "5",
          status: "completed",
          title: "Service Completed",
          description: "All work has been completed successfully",
          timestamp: new Date("2024-01-25T12:30:00"),
          completed: false,
          icon: "checkmark-done",
        },
      ],
    },
    services: [
      {
        id: "1",
        name: "Smart Home Setup",
        description: "Smart switches, automation, and IoT device installation",
        price: 1200,
        duration: 3,
        completed: false,
      },
      {
        id: "2",
        name: "Basic Electrical Repair",
        description: "Switch and socket repairs",
        price: 500,
        duration: 1,
        completed: true,
      },
    ],
    worker: {
      id: "1",
      name: "Rajesh Kumar",
      profession: "Master Electrician",
      rating: 4.9,
      reviewCount: 247,
      profileImage: workerImage,
      phone: "+91 98765 43210",
      location: {
        latitude: 28.6139,
        longitude: 77.209,
      },
      estimatedArrival: "2:30 PM",
      verified: true,
    },
    customer: {
      name: "Priya Sharma",
      phone: "+91 98765 43211",
      address: "A-204, Green Valley Apartments, Sector 18, Noida",
    },
    scheduling: {
      date: new Date("2024-01-25T10:00:00"),
      timeSlot: "10:00 AM - 1:00 PM",
      duration: 4,
      urgency: "normal",
    },
    location: {
      address: "A-204, Green Valley Apartments, Sector 18, Noida",
      coordinates: { latitude: 28.5665, longitude: 77.2431 },
      instructions: "Ring the doorbell twice. Parking available in basement.",
    },
    pricing: {
      serviceTotal: 1700,
      urgencyFee: 0,
      platformFee: 85,
      taxes: 321,
      discount: 0,
      total: 2106,
      paid: 2106,
      paymentMethod: "UPI",
      paymentStatus: "paid",
    },
    communication: {
      chatEnabled: true,
      callEnabled: true,
      lastMessage: {
        text: "I'll be there in 10 minutes. Just finishing up the previous job.",
        timestamp: new Date("2024-01-25T09:50:00"),
        sender: "worker",
      },
    },
    photos: {
      before: ["/placeholder.svg?height=200&width=300"],
      after: [],
      progress: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    invoice: {
      number: "INV-240125001",
      downloadUrl: "https://example.com/invoice.pdf",
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "worker_assigned":
        return theme.colors.blue
      case "on_the_way":
        return theme.colors.warning
      case "in_progress":
        return theme.colors.primary
      case "completed":
        return theme.colors.success
      case "cancelled":
        return theme.colors.error
      default:
        return theme.colors.textLighter
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed"
      case "worker_assigned":
        return "Professional Assigned"
      case "on_the_way":
        return "On The Way"
      case "in_progress":
        return "In Progress"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
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

  const handleCall = () => {
    Linking.openURL(`tel:${booking.worker.phone}`)
  }

  const handleChat = () => {
    // Navigate to chat screen
    console.log("Open chat with worker")
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }

  const handleReschedule = () => {
    setShowRescheduleModal(true)
  }

  const handleRate = () => {
    setShowRatingModal(true)
  }

  const handleRebook = () => {
    // Navigate to booking screen with pre-filled data
    console.log("Rebook service")
  }

  // Simulate real-time location updates
  useEffect(() => {
    if (booking.status.current === "on_the_way" || booking.status.current === "in_progress") {
      locationUpdateInterval.current = setInterval(() => {
        setWorkerLocation((prev) => ({
          ...prev,
          latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
          heading: prev.heading + (Math.random() - 0.5) * 10,
          speed: 20 + Math.random() * 15,
        }))

        setDistanceToCustomer((prev) => Math.max(0.1, prev - 0.05 + (Math.random() - 0.7) * 0.1))
        setEstimatedArrival((prev) => Math.max(1, Math.round(prev - 0.2 + (Math.random() - 0.7) * 0.5)))
      }, 3000) // Update every 3 seconds

      return () => {
        if (locationUpdateInterval.current) {
          clearInterval(locationUpdateInterval.current)
        }
      }
    }
  }, [booking.status.current])

  const StatusHeader = () => {
    const statusAnim = useSharedValue(0)

    useEffect(() => {
      statusAnim.value = withSpring(1, { damping: 20, stiffness: 90 })
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: statusAnim.value }],
      opacity: statusAnim.value,
    }))

    return (
      <Animated.View style={[styles.statusHeader, { backgroundColor: theme.colors.backgroundLight }, animatedStyle]}>
        <View style={styles.statusContent}>
          <View style={[styles.statusIcon, { backgroundColor: `${getStatusColor(booking.status.current)}20` }]}>
            <Ionicons
              name={
                booking.status.current === "completed"
                  ? "checkmark-done"
                  : booking.status.current === "in_progress"
                    ? "construct"
                    : booking.status.current === "on_the_way"
                      ? "car"
                      : booking.status.current === "cancelled"
                        ? "close-circle"
                        : "checkmark-circle"
              }
              size={32}
              color={getStatusColor(booking.status.current)}
            />
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: getStatusColor(booking.status.current) }]}>
              {getStatusText(booking.status.current)}
            </Text>
            <Text style={[styles.bookingNumber, { color: theme.colors.text }]}>#{booking.bookingNumber}</Text>
            <Text style={[styles.statusDescription, { color: theme.colors.textLight }]}>
              {booking.status.current === "in_progress"
                ? `Work started at ${formatTime(booking.scheduling.date)}`
                : booking.status.current === "on_the_way"
                  ? `${distanceToCustomer.toFixed(1)}km away • ETA ${estimatedArrival} min`
                  : booking.status.current === "completed"
                    ? "Service completed successfully"
                    : "Booking confirmed and scheduled"}
            </Text>
          </View>
        </View>

        {booking.status.current === "in_progress" && (
          <View style={[styles.liveIndicator, { backgroundColor: theme.colors.error }]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </Animated.View>
    )
  }

  const WorkerCard = () => {
    const cardAnim = useSharedValue(0)

    useEffect(() => {
      cardAnim.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 90 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: (1 - cardAnim.value) * 50 }],
      opacity: cardAnim.value,
    }))

    return (
      <Animated.View style={[styles.workerCard, { backgroundColor: theme.colors.backgroundLight }, animatedStyle]}>
        <View style={styles.workerHeader}>
          <Image source={booking.worker.profileImage} style={styles.workerAvatar} />
          <View style={styles.workerInfo}>
            <View style={styles.workerNameRow}>
              <Text style={[styles.workerName, { color: theme.colors.text }]}>{booking.worker.name}</Text>
              {booking.worker.verified && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
            </View>
            <Text style={[styles.workerProfession, { color: theme.colors.textLight }]}>
              {booking.worker.profession}
            </Text>
            <View style={styles.workerMeta}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color={theme.colors.warning} />
                <Text style={[styles.ratingText, { color: theme.colors.textLight }]}>{booking.worker.rating}</Text>
                <Text style={[styles.reviewCount, { color: theme.colors.textLighter }]}>
                  ({booking.worker.reviewCount})
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.workerActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
              onPress={handleCall}
            >
              <Ionicons name="call" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleChat}
            >
              <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {booking.communication.lastMessage && (
          <View style={[styles.lastMessage, { backgroundColor: theme.colors.backgroundSoft }]}>
            <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textLight} />
            <Text style={[styles.messageText, { color: theme.colors.textLight }]} numberOfLines={2}>
              {booking.communication.lastMessage.text}
            </Text>
            <Text style={[styles.messageTime, { color: theme.colors.textLighter }]}>
              {formatTime(booking.communication.lastMessage.timestamp)}
            </Text>
          </View>
        )}
      </Animated.View>
    )
  }

  const TimelineSection = () => {
    const TimelineItem = ({ item, index, isLast }: { item: any; index: number; isLast: boolean }) => {
      const itemAnim = useSharedValue(0)

      useEffect(() => {
        itemAnim.value = withDelay(400 + index * 150, withSpring(1, { damping: 20, stiffness: 90 }))
      }, [])

      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: (1 - itemAnim.value) * 50 }],
        opacity: itemAnim.value,
      }))

      return (
        <Animated.View style={[styles.timelineItem, animatedStyle]}>
          <View style={styles.timelineLeft}>
            <View
              style={[
                styles.timelineIcon,
                {
                  backgroundColor: item.completed ? getStatusColor(item.status) : `${getStatusColor(item.status)}20`,
                },
              ]}
            >
              <Ionicons name={item.icon} size={16} color={item.completed ? "#FFFFFF" : getStatusColor(item.status)} />
            </View>
            {!isLast && (
              <View
                style={[
                  styles.timelineLine,
                  {
                    backgroundColor: item.completed ? getStatusColor(item.status) : theme.colors.border,
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.timelineContent}>
            <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.timelineDescription, { color: theme.colors.textLight }]}>{item.description}</Text>
            <Text style={[styles.timelineTime, { color: theme.colors.textLighter }]}>{formatTime(item.timestamp)}</Text>
          </View>
        </Animated.View>
      )
    }

    return (
      <View style={[styles.timelineSection, { backgroundColor: theme.colors.backgroundLight }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service Timeline</Text>
        <View style={styles.timelineContainer}>
          {booking.status.timeline.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={index}
              isLast={index === booking.status.timeline.length - 1}
            />
          ))}
        </View>
      </View>
    )
  }

  const ServicesSection = () => (
    <View style={[styles.servicesSection, { backgroundColor: theme.colors.backgroundLight }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Services</Text>
      {booking.services.map((service, index) => (
        <View key={service.id} style={styles.serviceItem}>
          <View style={styles.serviceHeader}>
            <View
              style={[
                styles.serviceStatus,
                {
                  backgroundColor: service.completed ? theme.colors.success : theme.colors.warning,
                },
              ]}
            >
              <Ionicons name={service.completed ? "checkmark" : "time"} size={12} color="#FFFFFF" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: theme.colors.text }]}>{service.name}</Text>
              <Text style={[styles.serviceDescription, { color: theme.colors.textLight }]}>{service.description}</Text>
            </View>
            <View style={styles.servicePricing}>
              <Text style={[styles.servicePrice, { color: theme.colors.text }]}>₹{service.price}</Text>
              <Text style={[styles.serviceDuration, { color: theme.colors.textLighter }]}>{service.duration}h</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  )

  const LocationSection = () => (
    <View style={[styles.locationSection, { backgroundColor: theme.colors.backgroundLight }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Location & Schedule</Text>

      <View style={styles.locationDetails}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color={theme.colors.primary} />
          <View style={styles.locationInfo}>
            <Text style={[styles.locationLabel, { color: theme.colors.textLighter }]}>Service Address</Text>
            <Text style={[styles.locationText, { color: theme.colors.text }]}>{booking.location.address}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
          <View style={styles.locationInfo}>
            <Text style={[styles.locationLabel, { color: theme.colors.textLighter }]}>Date & Time</Text>
            <Text style={[styles.locationText, { color: theme.colors.text }]}>
              {formatDate(booking.scheduling.date)}
            </Text>
            <Text style={[styles.locationSubtext, { color: theme.colors.textLight }]}>
              {booking.scheduling.timeSlot}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="time" size={20} color={theme.colors.primary} />
          <View style={styles.locationInfo}>
            <Text style={[styles.locationLabel, { color: theme.colors.textLighter }]}>Duration</Text>
            <Text style={[styles.locationText, { color: theme.colors.text }]}>{booking.scheduling.duration} hours</Text>
          </View>
        </View>

        {booking.location.instructions && (
          <View style={styles.locationRow}>
            <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
            <View style={styles.locationInfo}>
              <Text style={[styles.locationLabel, { color: theme.colors.textLighter }]}>Special Instructions</Text>
              <Text style={[styles.locationText, { color: theme.colors.text }]}>{booking.location.instructions}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )

  const LiveLocationSection = () => {
    if (booking.status.current !== "on_the_way" && booking.status.current !== "in_progress") {
      return null
    }

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: (1 - locationAnim.value) * 50 }],
      opacity: locationAnim.value,
    }))

    return (
      <Animated.View
        style={[styles.locationTrackingSection, { backgroundColor: theme.colors.backgroundLight }, animatedStyle]}
      >
        <View style={styles.locationHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Live Location</Text>
          <View style={[styles.liveLocationBadge, { backgroundColor: theme.colors.success }]}>
            <View style={styles.livePulse} />
            <Text style={styles.liveLocationText}>LIVE</Text>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={[styles.mapContainer, { backgroundColor: theme.colors.backgroundSoft }]}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={40} color={theme.colors.primary} />
            <Text style={[styles.mapPlaceholderText, { color: theme.colors.textLight }]}>Live Map View</Text>
            <Text style={[styles.mapSubtext, { color: theme.colors.textLighter }]}>
              Worker location updates every 30 seconds
            </Text>
          </View>

          {/* Worker Location Marker */}
          <View style={[styles.workerMarker, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>

          {/* Customer Location Marker */}
          <View style={[styles.customerMarker, { backgroundColor: theme.colors.error }]}>
            <Ionicons name="home" size={16} color="#FFFFFF" />
          </View>

          {/* Route Line */}
          <View style={[styles.routeLine, { backgroundColor: theme.colors.primary }]} />
        </View>

        {/* Location Stats */}
        <View style={styles.locationStats}>
          <View style={styles.locationStatItem}>
            <View style={[styles.statIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="navigate" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{distanceToCustomer.toFixed(1)} km</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Distance Away</Text>
            </View>
          </View>

          <View style={styles.locationStatItem}>
            <View style={[styles.statIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
              <Ionicons name="time" size={20} color={theme.colors.warning} />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{estimatedArrival} min</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>ETA</Text>
            </View>
          </View>

          <View style={styles.locationStatItem}>
            <View style={[styles.statIcon, { backgroundColor: `${theme.colors.success}20` }]}>
              <Ionicons name="speedometer" size={20} color={theme.colors.success} />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {Math.round(workerLocation.speed)} km/h
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Current Speed</Text>
            </View>
          </View>
        </View>

        {/* Location Actions */}
        <View style={styles.locationActions}>
          <TouchableOpacity
            style={[styles.locationActionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => console.log("Open full map")}
          >
            <Ionicons name="map" size={20} color="#FFFFFF" />
            <Text style={styles.locationActionText}>View Full Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.locationActionButton, { backgroundColor: theme.colors.success }]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color="#FFFFFF" />
            <Text style={styles.locationActionText}>Call Worker</Text>
          </TouchableOpacity>
        </View>

        {/* Location Sharing Status */}
        <View style={styles.locationSharingStatus}>
          <View style={styles.sharingInfo}>
            <Ionicons
              name={isLocationSharing ? "shield-checkmark" : "shield-outline"}
              size={16}
              color={isLocationSharing ? theme.colors.success : theme.colors.textLight}
            />
            <Text style={[styles.sharingText, { color: theme.colors.textLight }]}>
              {isLocationSharing ? "Location sharing enabled" : "Location sharing disabled"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsLocationSharing(!isLocationSharing)} style={styles.sharingToggle}>
            <Text style={[styles.sharingToggleText, { color: theme.colors.primary }]}>
              {isLocationSharing ? "Disable" : "Enable"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  const PricingSection = () => (
    <View style={[styles.pricingSection, { backgroundColor: theme.colors.backgroundLight }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Details</Text>

      <View style={styles.pricingDetails}>
        <View style={styles.pricingRow}>
          <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Services Total</Text>
          <Text style={[styles.pricingValue, { color: theme.colors.text }]}>₹{booking.pricing.serviceTotal}</Text>
        </View>

        {booking.pricing.urgencyFee > 0 && (
          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Urgency Fee</Text>
            <Text style={[styles.pricingValue, { color: theme.colors.warning }]}>₹{booking.pricing.urgencyFee}</Text>
          </View>
        )}

        <View style={styles.pricingRow}>
          <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Platform Fee</Text>
          <Text style={[styles.pricingValue, { color: theme.colors.text }]}>₹{booking.pricing.platformFee}</Text>
        </View>

        <View style={styles.pricingRow}>
          <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Taxes (18%)</Text>
          <Text style={[styles.pricingValue, { color: theme.colors.text }]}>₹{booking.pricing.taxes}</Text>
        </View>

        {booking.pricing.discount > 0 && (
          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.success }]}>Discount</Text>
            <Text style={[styles.pricingValue, { color: theme.colors.success }]}>-₹{booking.pricing.discount}</Text>
          </View>
        )}

        <View style={[styles.pricingDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.pricingRow}>
          <Text style={[styles.pricingTotalLabel, { color: theme.colors.text }]}>Total Amount</Text>
          <Text style={[styles.pricingTotalValue, { color: theme.colors.text }]}>₹{booking.pricing.total}</Text>
        </View>

        <View style={styles.paymentStatus}>
          <View style={styles.paymentMethod}>
            <Ionicons name="card" size={16} color={theme.colors.primary} />
            <Text style={[styles.paymentMethodText, { color: theme.colors.textLight }]}>
              Paid via {booking.pricing.paymentMethod}
            </Text>
          </View>
          <View style={[styles.paymentStatusBadge, { backgroundColor: theme.colors.success }]}>
            <Text style={styles.paymentStatusText}>PAID</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const ActionButtons = () => {
    const getActions = () => {
      switch (booking.status.current) {
        case "confirmed":
        case "worker_assigned":
          return [
            { key: "reschedule", label: "Reschedule", icon: "calendar", action: handleReschedule },
            { key: "cancel", label: "Cancel", icon: "close", action: handleCancel, danger: true },
          ]
        case "on_the_way":
        case "in_progress":
          return [
            { key: "track", label: "Track Live", icon: "location", action: () => console.log("Track") },
            {
              key: "emergency",
              label: "Emergency",
              icon: "warning",
              action: () => console.log("Emergency"),
              danger: true,
            },
          ]
        case "completed":
          return [
            { key: "rate", label: "Rate Service", icon: "star", action: handleRate },
            { key: "rebook", label: "Book Again", icon: "refresh", action: handleRebook },
            { key: "invoice", label: "Download Invoice", icon: "download", action: () => console.log("Download") },
          ]
        default:
          return []
      }
    }

    const actions = getActions()

    return (
      <View style={styles.actionButtons}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={action.key}
            style={[
              styles.actionButton,
              {
                backgroundColor: action.danger ? theme.colors.error : theme.colors.primary,
                flex: 1,
              },
            ]}
            onPress={action.action}
          >
            <Ionicons name={action.icon as any} size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  const RatingModal = () => (
    <Modal visible={showRatingModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.ratingModal, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Rate Your Experience</Text>
            <TouchableOpacity onPress={() => setShowRatingModal(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContent}>
            <Image source={booking.worker.profileImage} style={styles.ratingAvatar} />
            <Text style={[styles.ratingWorkerName, { color: theme.colors.text }]}>{booking.worker.name}</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                  <Ionicons
                    name={star <= selectedRating ? "star" : "star-outline"}
                    size={32}
                    color={star <= selectedRating ? theme.colors.warning : theme.colors.border}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.ratingLabel, { color: theme.colors.textLight }]}>
              {selectedRating === 5
                ? "Excellent!"
                : selectedRating === 4
                  ? "Good"
                  : selectedRating === 3
                    ? "Average"
                    : selectedRating === 2
                      ? "Poor"
                      : selectedRating === 1
                        ? "Very Poor"
                        : "Tap to rate"}
            </Text>

            <View style={styles.reviewInput}>
              <Text style={[styles.reviewLabel, { color: theme.colors.text }]}>Write a review (optional)</Text>
              {/* TextInput would go here */}
            </View>

            <TouchableOpacity
              style={[
                styles.submitRatingButton,
                {
                  backgroundColor: selectedRating > 0 ? theme.colors.primary : theme.colors.backgroundSoft,
                },
              ]}
              disabled={selectedRating === 0}
            >
              <Text
                style={[styles.submitRatingText, { color: selectedRating > 0 ? "#FFFFFF" : theme.colors.textLighter }]}
              >
                Submit Rating
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Booking Details</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <StatusHeader />
        <WorkerCard />
        <TimelineSection />
        <ServicesSection />
        <LocationSection />
        <LiveLocationSection />
        <PricingSection />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border },
        ]}
      >
        <ActionButtons />
      </View>

      <RatingModal />
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  shareButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  statusHeader: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    position: "relative",
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  bookingNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  liveIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  workerCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  workerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 16,
  },
  workerInfo: {
    flex: 1,
  },
  workerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  workerName: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  workerProfession: {
    fontSize: 14,
    marginBottom: 6,
  },
  workerMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 2,
  },
  workerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  lastMessage: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
  },
  timelineSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
  },
  servicesSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  serviceItem: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  servicePricing: {
    alignItems: "flex-end",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 12,
  },
  locationSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  locationDetails: {
    gap: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  locationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  locationSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  pricingSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  pricingDetails: {
    gap: 12,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pricingLabel: {
    fontSize: 14,
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  pricingDivider: {
    height: 1,
    marginVertical: 8,
  },
  pricingTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  pricingTotalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  paymentStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodText: {
    fontSize: 14,
    marginLeft: 8,
  },
  paymentStatusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingModal: {
    borderRadius: 24,
    padding: 24,
    margin: 20,
    width: width - 40,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  ratingContent: {
    alignItems: "center",
  },
  ratingAvatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  ratingWorkerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 24,
  },
  reviewInput: {
    width: "100%",
    marginBottom: 24,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  submitRatingButton: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitRatingText: {
    fontSize: 16,
    fontWeight: "700",
  },
  locationTrackingSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  liveLocationBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "relative",
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 6,
  },
  liveLocationText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  workerMarker: {
    position: "absolute",
    top: 60,
    left: 80,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  customerMarker: {
    position: "absolute",
    bottom: 40,
    right: 60,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  routeLine: {
    position: "absolute",
    top: 76,
    left: 96,
    width: 120,
    height: 2,
    transform: [{ rotate: "35deg" }],
    opacity: 0.6,
  },
  locationStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationStatItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  locationActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  locationActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  locationActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  locationSharingStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  sharingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sharingText: {
    fontSize: 12,
    marginLeft: 8,
  },
  sharingToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sharingToggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
})

export default BookingDetailScreen
