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
  Modal,
  Dimensions,
  StatusBar,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated"
import { useTheme } from "../contexts/themeContext"

const { width, height } = Dimensions.get("window")
const HEADER_HEIGHT = 280

const workerImage = require("../images/man.jpg")

interface JobTimeline {
  id: string
  title: string
  description: string
  timestamp: Date
  status: "completed" | "in-progress" | "pending"
  icon: string
}

interface JobImage {
  id: string
  url: string
  type: "before" | "after" | "progress"
  caption?: string
}

interface JobDetails {
  id: string
  title: string
  description: string
  category: string
  status: "completed" | "in-progress" | "cancelled"
  startDate: Date
  completedDate?: Date
  duration: number
  location: {
    address: string
    coordinates: { latitude: number; longitude: number }
  }
  customer: {
    name: string
    phone: string
    avatar?: any
  }
  worker: {
    id: string
    name: string
    category: string
    rating: number
    avatar: any
    phone: string
  }
  pricing: {
    originalPrice: number
    finalPrice: number
    discount?: number
    taxes: number
    totalAmount: number
    paymentMethod: string
    paymentStatus: "paid" | "pending" | "failed"
  }
  rating?: number
  review?: string
  images: JobImage[]
  timeline: JobTimeline[]
  materials: string[]
  warranty: {
    duration: string
    terms: string
  }
  emergencyJob: boolean
  repeatCustomer: boolean
}

const JobDetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme, isDark } = useTheme()
  const scrollY = useSharedValue(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "photos">("details")

  const jobDetails: JobDetails = {
    id: "JOB001",
    title: "Smart Home Electrical Setup",
    description:
      "Complete smart home automation system installation including smart switches, automated lighting, security system integration, and mobile app setup for 3BHK apartment.",
    category: "Electrical Work",
    status: "completed",
    startDate: new Date("2024-01-15T09:00:00"),
    completedDate: new Date("2024-01-17T18:30:00"),
    duration: 2.5, // days
    location: {
      address: "A-204, Green Valley Apartments, Sector 18, Noida",
      coordinates: { latitude: 28.5665, longitude: 77.2431 },
    },
    customer: {
      name: "Priya Sharma",
      phone: "+91 98765 43210",
    },
    worker: {
      id: "1",
      name: "Rajesh Kumar",
      category: "Master Electrician",
      rating: 4.9,
      avatar: workerImage,
      phone: "+91 98765 43210",
    },
    pricing: {
      originalPrice: 45000,
      finalPrice: 42000,
      discount: 3000,
      taxes: 4200,
      totalAmount: 46200,
      paymentMethod: "UPI",
      paymentStatus: "paid",
    },
    rating: 5,
    review:
      "Absolutely fantastic work! Rajesh was very professional and completed the smart home setup perfectly. Everything works seamlessly with the mobile app. Highly recommend his services!",
    images: [
      {
        id: "1",
        url: "/placeholder.svg?height=300&width=400",
        type: "before",
        caption: "Living room before installation",
      },
      {
        id: "2",
        url: "/placeholder.svg?height=300&width=400",
        type: "after",
        caption: "Smart switches and lighting installed",
      },
      {
        id: "3",
        url: "/placeholder.svg?height=300&width=400",
        type: "after",
        caption: "Mobile app control interface",
      },
      {
        id: "4",
        url: "/placeholder.svg?height=300&width=400",
        type: "progress",
        caption: "Wiring work in progress",
      },
      {
        id: "5",
        url: "/placeholder.svg?height=300&width=400",
        type: "after",
        caption: "Completed smart home setup",
      },
    ],
    timeline: [
      {
        id: "1",
        title: "Job Booked",
        description: "Customer booked the smart home installation service",
        timestamp: new Date("2024-01-14T10:30:00"),
        status: "completed",
        icon: "calendar",
      },
      {
        id: "2",
        title: "Worker Assigned",
        description: "Rajesh Kumar was assigned to this job",
        timestamp: new Date("2024-01-14T11:00:00"),
        status: "completed",
        icon: "person",
      },
      {
        id: "3",
        title: "Site Visit",
        description: "Initial assessment and planning completed",
        timestamp: new Date("2024-01-14T16:00:00"),
        status: "completed",
        icon: "location",
      },
      {
        id: "4",
        title: "Work Started",
        description: "Installation work began as scheduled",
        timestamp: new Date("2024-01-15T09:00:00"),
        status: "completed",
        icon: "construct",
      },
      {
        id: "5",
        title: "Progress Update",
        description: "50% work completed - wiring and switches installed",
        timestamp: new Date("2024-01-16T14:00:00"),
        status: "completed",
        icon: "trending-up",
      },
      {
        id: "6",
        title: "Work Completed",
        description: "Smart home setup completed and tested successfully",
        timestamp: new Date("2024-01-17T18:30:00"),
        status: "completed",
        icon: "checkmark-circle",
      },
      {
        id: "7",
        title: "Payment Received",
        description: "Payment of ₹46,200 received via UPI",
        timestamp: new Date("2024-01-17T19:00:00"),
        status: "completed",
        icon: "card",
      },
    ],
    materials: [
      "Smart Switches (12 units)",
      "LED Smart Bulbs (8 units)",
      "Motion Sensors (4 units)",
      "Smart Hub Controller",
      "Electrical Wiring (50 meters)",
      "Junction Boxes (6 units)",
    ],
    warranty: {
      duration: "2 Years",
      terms: "Covers all electrical components and installation work. Free service calls for any issues.",
    },
    emergencyJob: false,
    repeatCustomer: false,
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT - 100], [0, 1], "clamp")
    return { opacity }
  })

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-100, 0, HEADER_HEIGHT], [1.2, 1, 0.8], "clamp")
    const translateY = interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, -HEADER_HEIGHT / 2], "clamp")
    return {
      transform: [{ scale }, { translateY }],
    }
  })

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, -50], "clamp")
    return {
      transform: [{ translateY }],
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.colors.success
      case "in-progress":
        return theme.colors.blue
      case "cancelled":
        return theme.colors.error
      default:
        return theme.colors.textLight
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

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} at ${formatTime(date)}`
  }

  const TimelineItem = ({ item, index, isLast }: { item: JobTimeline; index: number; isLast: boolean }) => {
    const fadeAnim = useSharedValue(0)
    const slideAnim = useSharedValue(30)

    useEffect(() => {
      fadeAnim.value = withDelay(index * 150, withTiming(1, { duration: 600 }))
      slideAnim.value = withDelay(index * 150, withSpring(0, { damping: 20, stiffness: 90 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    }))

    return (
      <Animated.View style={[styles.timelineItem, animatedStyle]}>
        <View style={styles.timelineLeft}>
          <View style={[styles.timelineIcon, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Ionicons name={item.icon as any} size={16} color={getStatusColor(item.status)} />
          </View>
          {!isLast && <View style={[styles.timelineLine, { backgroundColor: theme.colors.border }]} />}
        </View>
        <View style={styles.timelineContent}>
          <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>{item.title}</Text>
          <Text style={[styles.timelineDescription, { color: theme.colors.textLight }]}>{item.description}</Text>
          <Text style={[styles.timelineTime, { color: theme.colors.textLighter }]}>
            {formatDateTime(item.timestamp)}
          </Text>
        </View>
      </Animated.View>
    )
  }

  const ImageThumbnail = ({ image, index }: { image: JobImage; index: number }) => {
    const scaleAnim = useSharedValue(1)

    const handlePress = () => {
      scaleAnim.value = withSpring(0.95, { damping: 15 }, () => {
        scaleAnim.value = withSpring(1, { damping: 15 })
      })
      setSelectedImageIndex(index)
      setShowImageModal(true)
    }

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }))

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View style={[styles.imageThumbnail, animatedStyle]}>
          <Image source={{ uri: image.url }} style={styles.thumbnailImage} />
          <View
            style={[
              styles.imageTypeTag,
              {
                backgroundColor:
                  image.type === "before"
                    ? theme.colors.warning
                    : image.type === "after"
                      ? theme.colors.success
                      : theme.colors.blue,
              },
            ]}
          >
            <Text style={styles.imageTypeText}>{image.type.toUpperCase()}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const TabButton = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.7}>
      <Text style={[styles.tabText, { color: isActive ? theme.colors.primary : theme.colors.textLight }]}>{title}</Text>
      {isActive && <View style={[styles.tabIndicator, { backgroundColor: theme.colors.primary }]} />}
    </TouchableOpacity>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <View style={styles.tabContent}>
            {/* Job Description */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Job Description</Text>
              <Text style={[styles.descriptionText, { color: theme.colors.textLight }]}>{jobDetails.description}</Text>
            </View>

            {/* Materials Used */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Materials Used</Text>
              <View style={styles.materialsContainer}>
                {jobDetails.materials.map((material, index) => (
                  <View key={index} style={[styles.materialItem, { backgroundColor: theme.colors.backgroundLight }]}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                    <Text style={[styles.materialText, { color: theme.colors.textLight }]}>{material}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Warranty Information */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Warranty</Text>
              <View style={[styles.warrantyCard, { backgroundColor: theme.colors.backgroundLight }]}>
                <View style={styles.warrantyHeader}>
                  <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
                  <Text style={[styles.warrantyDuration, { color: theme.colors.text }]}>
                    {jobDetails.warranty.duration}
                  </Text>
                </View>
                <Text style={[styles.warrantyTerms, { color: theme.colors.textLight }]}>
                  {jobDetails.warranty.terms}
                </Text>
              </View>
            </View>

            {/* Customer Review */}
            {jobDetails.rating && jobDetails.review && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Customer Review</Text>
                <View style={[styles.reviewCard, { backgroundColor: theme.colors.backgroundLight }]}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.customerName, { color: theme.colors.text }]}>{jobDetails.customer.name}</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name="star"
                          size={16}
                          color={star <= jobDetails.rating! ? theme.colors.warning : theme.colors.border}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewText, { color: theme.colors.textLight }]}>{jobDetails.review}</Text>
                </View>
              </View>
            )}
          </View>
        )

      case "timeline":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Job Timeline</Text>
            <View style={styles.timelineContainer}>
              {jobDetails.timeline.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  index={index}
                  isLast={index === jobDetails.timeline.length - 1}
                />
              ))}
            </View>
          </View>
        )

      case "photos":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Job Photos ({jobDetails.images.length})
            </Text>
            <View style={styles.photosGrid}>
              {jobDetails.images.map((image, index) => (
                <ImageThumbnail key={image.id} image={image} index={index} />
              ))}
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      {/* Animated Header */}
      <View style={[styles.animatedHeader, { backgroundColor: theme.colors.background }, headerAnimatedStyle]}>
        <SafeAreaView style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Job Details</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View style={[styles.heroImageContainer, imageAnimatedStyle]}>
            <Image source={{ uri: jobDetails.images[0]?.url }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(jobDetails.status) }]}>
                <Text style={styles.statusText}>{jobDetails.status.toUpperCase()}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Job Info Section */}
        <Animated.View style={[styles.jobInfoSection, contentAnimatedStyle]}>
          <View style={styles.jobHeader}>
            <Text style={[styles.jobTitle, { color: theme.colors.text }]}>{jobDetails.title}</Text>
            <Text style={[styles.jobCategory, { color: theme.colors.primary }]}>{jobDetails.category}</Text>
          </View>

          {/* Key Details Cards */}
          <View style={styles.detailsGrid}>
            <View style={[styles.detailCard, { backgroundColor: theme.colors.backgroundLight }]}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textLighter }]}>Completed</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {jobDetails.completedDate ? formatDate(jobDetails.completedDate) : "In Progress"}
              </Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.colors.backgroundLight }]}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textLighter }]}>Duration</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {jobDetails.duration} {jobDetails.duration === 1 ? "day" : "days"}
              </Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.colors.backgroundLight }]}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textLighter }]}>Location</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]} numberOfLines={2}>
                {jobDetails.location.address.split(",")[0]}
              </Text>
            </View>
          </View>

          {/* Worker Info */}
          <View style={[styles.workerCard, { backgroundColor: theme.colors.backgroundLight }]}>
            <Image source={jobDetails.worker.avatar} style={styles.workerAvatar} />
            <View style={styles.workerInfo}>
              <Text style={[styles.workerName, { color: theme.colors.text }]}>{jobDetails.worker.name}</Text>
              <Text style={[styles.workerCategory, { color: theme.colors.textLight }]}>
                {jobDetails.worker.category}
              </Text>
              <View style={styles.workerRating}>
                <Ionicons name="star" size={14} color={theme.colors.warning} />
                <Text style={[styles.workerRatingText, { color: theme.colors.textLight }]}>
                  {jobDetails.worker.rating}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.callButton, { backgroundColor: theme.colors.success }]}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Pricing Card */}
          <View style={[styles.pricingCard, { backgroundColor: theme.colors.backgroundLight }]}>
            <Text style={[styles.pricingTitle, { color: theme.colors.text }]}>Payment Summary</Text>
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Service Charge</Text>
              <Text style={[styles.pricingValue, { color: theme.colors.text }]}>
                ₹{jobDetails.pricing.finalPrice.toLocaleString()}
              </Text>
            </View>
            {jobDetails.pricing.discount && (
              <View style={styles.pricingRow}>
                <Text style={[styles.pricingLabel, { color: theme.colors.success }]}>Discount</Text>
                <Text style={[styles.pricingValue, { color: theme.colors.success }]}>
                  -₹{jobDetails.pricing.discount.toLocaleString()}
                </Text>
              </View>
            )}
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Taxes & Fees</Text>
              <Text style={[styles.pricingValue, { color: theme.colors.text }]}>
                ₹{jobDetails.pricing.taxes.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.pricingDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingTotalLabel, { color: theme.colors.text }]}>Total Paid</Text>
              <Text style={[styles.pricingTotalValue, { color: theme.colors.text }]}>
                ₹{jobDetails.pricing.totalAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.paymentMethodRow}>
              <Text style={[styles.paymentMethod, { color: theme.colors.textLight }]}>
                Paid via {jobDetails.pricing.paymentMethod}
              </Text>
              <View style={[styles.paymentStatus, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.paymentStatusText}>PAID</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Tabs */}
        <Animated.View style={[styles.tabsContainer, contentAnimatedStyle]}>
          <TabButton title="Details" isActive={activeTab === "details"} onPress={() => setActiveTab("details")} />
          <TabButton title="Timeline" isActive={activeTab === "timeline"} onPress={() => setActiveTab("timeline")} />
          <TabButton title="Photos" isActive={activeTab === "photos"} onPress={() => setActiveTab("photos")} />
        </Animated.View>

        {/* Tab Content */}
        <Animated.View style={contentAnimatedStyle}>{renderTabContent()}</Animated.View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={[styles.bottomBar, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}
      >
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.backgroundLight }]}>
          <Ionicons name="download-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.backgroundLight }]}>
          <Ionicons name="refresh" size={24} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Book Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="star" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Rate Job</Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <Modal visible={showImageModal} animationType="fade" transparent>
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity style={styles.imageModalClose} onPress={() => setShowImageModal(false)}>
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {jobDetails.images[selectedImageIndex] && (
            <View style={styles.imageModalContent}>
              <Image
                source={{ uri: jobDetails.images[selectedImageIndex].url }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
              <View style={styles.imageModalInfo}>
                <Text style={styles.imageModalCaption}>{jobDetails.images[selectedImageIndex].caption}</Text>
                <Text style={styles.imageModalCounter}>
                  {selectedImageIndex + 1} of {jobDetails.images.length}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  heroImageContainer: {
    flex: 1,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  jobInfoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  jobHeader: {
    marginBottom: 24,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  jobCategory: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailsGrid: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  detailCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  workerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  workerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  workerCategory: {
    fontSize: 14,
    marginBottom: 4,
  },
  workerRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  workerRatingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pricingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 14,
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  pricingDivider: {
    height: 1,
    marginVertical: 12,
  },
  pricingTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  pricingTotalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  paymentMethodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  paymentMethod: {
    fontSize: 14,
  },
  paymentStatus: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: 30,
    borderRadius: 2,
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  materialsContainer: {
    gap: 8,
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
  },
  materialText: {
    fontSize: 14,
    marginLeft: 8,
  },
  warrantyCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  warrantyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  warrantyDuration: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  warrantyTerms: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
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
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageThumbnail: {
    width: (width - 64) / 2,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  imageTypeTag: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  imageTypeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 12,
    gap: 8,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 12,
    gap: 8,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalClose: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  imageModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  fullScreenImage: {
    width: width - 40,
    height: height - 200,
  },
  imageModalInfo: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  imageModalCaption: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  imageModalCounter: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
})

export default JobDetailsScreen
