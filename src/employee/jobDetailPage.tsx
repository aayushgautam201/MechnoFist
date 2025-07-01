"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  Linking,
  Alert,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../contexts/themeContext"

const { width } = Dimensions.get("window")

interface JobDetail {
  id: string
  clientName: string
  clientPhone: string
  clientEmail: string
  clientImage: string
  serviceType: string
  category: string
  description: string
  detailedDescription: string
  location: {
    address: string
    coordinates: { latitude: number; longitude: number }
    landmark: string
  }
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: number
  price: number
  status: "Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled"
  priority: "high" | "medium" | "low"
  distance: string
  travelTime: string
  requirements: string[]
  tools: string[]
  materials: string[]
  specialInstructions: string
  clientRating: number
  clientReviews: number
  paymentMethod: string
  jobImages: string[]
  createdAt: string
  acceptedAt?: string
  completedAt?: string
}

interface ClientReview {
  id: string
  rating: number
  comment: string
  date: string
  jobType: string
}

const mockJobDetail: JobDetail = {
  id: "JOB-2024-001",
  clientName: "Anita Sharma",
  clientPhone: "+91 98765 43210",
  clientEmail: "anita.sharma@email.com",
  clientImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
  serviceType: "Electrical Panel Installation",
  category: "Electrical Work",
  description: "Complete electrical panel installation for 3BHK apartment",
  detailedDescription:
    "Installation of new electrical panel with circuit breakers, proper earthing, and safety switches. Includes testing of all connections and providing safety certificate.",
  location: {
    address: "A-204, Green Valley Apartments, Sector 15, Noida, UP 201301",
    coordinates: { latitude: 28.5355, longitude: 77.391 },
    landmark: "Near City Center Mall, opposite HDFC Bank",
  },
  scheduledDate: "Today",
  scheduledTime: "2:00 PM - 5:00 PM",
  estimatedDuration: 3,
  price: 1200,
  status: "Accepted",
  priority: "high",
  distance: "2.3 km",
  travelTime: "8 mins",
  requirements: [
    "Electrical panel box (provided by client)",
    "Circuit breakers (15A, 20A, 32A)",
    "Copper wiring",
    "Earth leakage circuit breaker",
  ],
  tools: ["Screwdriver set", "Wire strippers", "Multimeter", "Drill machine", "Safety equipment"],
  materials: ["Electrical tape", "Wire nuts", "Cable ties", "Mounting screws"],
  specialInstructions:
    "Please ensure power is completely shut off before starting work. Client will be available throughout the job duration.",
  clientRating: 4.8,
  clientReviews: 23,
  paymentMethod: "Cash on Completion",
  jobImages: [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
  ],
  createdAt: "2024-01-15T08:30:00Z",
  acceptedAt: "2024-01-15T09:15:00Z",
}

const mockClientReviews: ClientReview[] = [
  {
    id: "1",
    rating: 5,
    comment: "Excellent work! Very professional and completed on time.",
    date: "2 weeks ago",
    jobType: "AC Repair",
  },
  {
    id: "2",
    rating: 4,
    comment: "Good service, arrived on time and fixed the issue quickly.",
    date: "1 month ago",
    jobType: "Wiring Installation",
  },
  {
    id: "3",
    rating: 5,
    comment: "Highly recommended! Very skilled and courteous.",
    date: "2 months ago",
    jobType: "Switch Replacement",
  },
]

const JobDetailScreen: React.FC = () => {
  const { theme, isDark } = useTheme()
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<"details" | "location" | "client">("details")
  const [jobStatus, setJobStatus] = useState<string>("Accepted")

  const getStatusColor = (status: string) => ({
    Completed: "#10B981",
    "In Progress": "#3B82F6",
    Accepted: "#8B5CF6",
    Pending: "#F59E0B",
    Cancelled: "#EF4444",
  }[status] || "#6B7280")

  const getPriorityColor = (priority: string) => ({
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981",
  }[priority] || "#6B7280")

  const handleContactAction = (type: "call" | "message") => {
    const url = type === "call" ? `tel:${mockJobDetail.clientPhone}` : `sms:${mockJobDetail.clientPhone}`
    Linking.openURL(url)
  }

  const handleNavigation = () => {
    const { latitude, longitude } = mockJobDetail.location.coordinates
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`)
  }

  const handleJobAction = (action: "start" | "complete") => {
    const message = action === "start" ? "Are you ready to start this job?" : "Mark this job as completed?"
    Alert.alert(
      action === "start" ? "Start Job" : "Complete Job",
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "start" ? "Start" : "Complete",
          onPress: () => setJobStatus(action === "start" ? "In Progress" : "Completed"),
        },
      ]
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <JobHeader
        job={mockJobDetail}
        status={jobStatus}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
        navigation={navigation}
        theme={theme}
      />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
      <View style={styles.contentContainer}>
        {activeTab === "details" && <DetailsTab job={mockJobDetail} theme={theme} />}
        {activeTab === "location" && (
          <LocationTab job={mockJobDetail} handleNavigation={handleNavigation} theme={theme} />
        )}
        {activeTab === "client" && (
          <ClientTab
            job={mockJobDetail}
            reviews={mockClientReviews}
            handleContactAction={handleContactAction}
            theme={theme}
          />
        )}
      </View>
      <ActionButtons
        status={jobStatus}
        handleJobAction={handleJobAction}
        handleContactAction={handleContactAction}
        handleNavigation={handleNavigation}
        theme={theme}
      />
    </SafeAreaView>
  )
}

interface JobHeaderProps {
  job: JobDetail
  status: string
  getStatusColor: (status: string) => string
  getPriorityColor: (priority: string) => string
  navigation: any
  theme: any
}

const JobHeader: React.FC<JobHeaderProps> = ({ job, status, getStatusColor, getPriorityColor, navigation, theme }) => (
  <View style={[styles.headerContainer, { backgroundColor: theme.colors.backgroundLight }]}>
    <View style={styles.headerContent}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.jobId, { color: theme.colors.textLight }]}>Job #{job.id}</Text>
          <Text style={[styles.jobTitle, { color: theme.colors.text }]}>{job.serviceType}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(job.priority) }]}>
          <Text style={styles.priorityText}>{job.priority.toUpperCase()}</Text>
        </View>
        <Text style={[styles.jobPrice, { color: "#10B981" }]}>₹{job.price}</Text>
      </View>
    </View>
  </View>
)

interface TabNavigationProps {
  activeTab: "details" | "location" | "client"
  setActiveTab: (tab: "details" | "location" | "client") => void
  theme: any
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, theme }) => {
  const tabs = [
    { id: "details", icon: "document-text", label: "Details" },
    { id: "location", icon: "location", label: "Location" },
    { id: "client", icon: "person", label: "Client" },
  ]

  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.colors.backgroundLight }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id as "details" | "location" | "client")}
        >
          <Ionicons
            name={tab.icon}
            size={20}
            color={activeTab === tab.id ? theme.colors.primary : theme.colors.textLight}
          />
          <Text
            style={[styles.tabText, { color: activeTab === tab.id ? theme.colors.primary : theme.colors.textLight }]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

interface DetailsTabProps {
  job: JobDetail
  theme: any
}

const DetailsTab: React.FC<DetailsTabProps> = ({ job, theme }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card title="Job Overview" theme={theme}>
      <View style={styles.overviewGrid}>
        {[
          { icon: "calendar-outline", label: "Date", value: job.scheduledDate },
          { icon: "time-outline", label: "Time", value: job.scheduledTime },
          { icon: "hourglass-outline", label: "Duration", value: `${job.estimatedDuration}h` },
          { icon: "card-outline", label: "Payment", value: job.paymentMethod },
        ].map((item, index) => (
          <View key={index} style={styles.overviewItem}>
            <Ionicons name={item.icon} size={16} color={theme.colors.textLight} />
            <Text style={[styles.overviewLabel, { color: theme.colors.textLight }]}>{item.label}</Text>
            <Text style={[styles.overviewValue, { color: theme.colors.text }]}>{item.value}</Text>
          </View>
        ))}
      </View>
    </Card>
    <Card title="Description" theme={theme}>
      <Text style={[styles.description, { color: theme.colors.textLight }]}>{job.detailedDescription}</Text>
    </Card>
    <Card title="Requirements" theme={theme}>
      {job.requirements.map((item, index) => (
        <ListItem key={index} text={item} theme={theme} />
      ))}
    </Card>
    <View style={styles.gridContainer}>
      <Card title="Tools Needed" theme={theme} style={styles.halfCard}>
        {job.tools.map((item, index) => (
          <ListItem key={index} text={item} theme={theme} icon="build-outline" size="small" />
        ))}
      </Card>
      <Card title="Materials" theme={theme} style={styles.halfCard}>
        {job.materials.map((item, index) => (
          <ListItem key={index} text={item} theme={theme} icon="cube-outline" size="small" />
        ))}
      </Card>
    </View>
    {job.specialInstructions && (
      <Card title="Special Instructions" theme={theme} style={[styles.instructionsCard, { borderLeftColor: "#D97706" }]}>
        <View style={styles.instructionsHeader}>
          <Ionicons name="warning-outline" size={20} color="#D97706" />
          <Text style={[styles.cardTitle, { color: "#92400E" }]}>Special Instructions</Text>
        </View>
        <Text style={[styles.instructionsText, { color: "#92400E" }]}>{job.specialInstructions}</Text>
      </Card>
    )}
    {job.jobImages.length > 0 && (
      <Card title="Reference Images" theme={theme}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
          {job.jobImages.map((image, index) => (
            <TouchableOpacity key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.jobImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card>
    )}
  </ScrollView>
)

interface LocationTabProps {
  job: JobDetail
  handleNavigation: () => void
  theme: any
}

const LocationTab: React.FC<LocationTabProps> = ({ job, handleNavigation, theme }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card title="Location" theme={theme}>
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={theme.colors.textLight} />
          <Text style={[styles.mapPlaceholderText, { color: theme.colors.textLight }]}>Interactive Map</Text>
          <Text style={[styles.mapSubText, { color: theme.colors.textLight }]}>
            {job.location.coordinates.latitude}, {job.location.coordinates.longitude}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.navigationButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleNavigation}
      >
        <Ionicons name="navigate" size={20} color="#FFFFFF" />
        <Text style={styles.navigationButtonText}>Open in Maps</Text>
      </TouchableOpacity>
    </Card>
    <Card title="Address Details" theme={theme}>
      {[
        { icon: "location-outline", label: "Full Address", value: job.location.address },
        { icon: "flag-outline", label: "Landmark", value: job.location.landmark },
      ].map((item, index) => (
        <View key={index} style={styles.addressItem}>
          <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
          <View style={styles.addressContent}>
            <Text style={[styles.addressLabel, { color: theme.colors.textLight }]}>{item.label}</Text>
            <Text style={[styles.addressText, { color: theme.colors.text }]}>{item.value}</Text>
          </View>
        </View>
      ))}
      <View style={styles.distanceRow}>
        {[
          { icon: "car-outline", text: `${job.distance} away` },
          { icon: "time-outline", text: `${job.travelTime} drive` },
        ].map((item, index) => (
          <View key={index} style={styles.distanceItem}>
            <Ionicons name={item.icon} size={16} color={theme.colors.textLight} />
            <Text style={[styles.distanceText, { color: theme.colors.textLight }]}>{item.text}</Text>
          </View>
        ))}
      </View>
    </Card>
  </ScrollView>
)

interface ClientTabProps {
  job: JobDetail
  reviews: ClientReview[]
  handleContactAction: (type: "call" | "message") => void
  theme: any
}

const ClientTab: React.FC<ClientTabProps> = ({ job, reviews, handleContactAction, theme }) => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Card title="Client Information" theme={theme}>
      <View style={styles.clientHeader}>
        <Image source={{ uri: job.clientImage }} style={styles.clientAvatar} />
        <View style={styles.clientInfo}>
          <Text style={[styles.clientName, { color: theme.colors.text }]}>{job.clientName}</Text>
          <View style={styles.clientRating}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: theme.colors.textLight }]}>
              {job.clientRating} ({job.clientReviews} reviews)
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.contactButtons}>
        {[
          { icon: "call", label: "Call", color: "#10B981", action: () => handleContactAction("call") },
          { icon: "chatbubble", label: "Message", color: "#3B82F6", action: () => handleContactAction("message") },
        ].map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.contactButton, { backgroundColor: button.color }]}
            onPress={button.action}
          >
            <Ionicons name={button.icon} size={18} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {[
        { icon: "call-outline", text: job.clientPhone },
        { icon: "mail-outline", text: job.clientEmail },
      ].map((item, index) => (
        <View key={index} style={styles.contactItem}>
          <Ionicons name={item.icon} size={16} color={theme.colors.textLight} />
          <Text style={[styles.contactText, { color: theme.colors.text }]}>{item.text}</Text>
        </View>
      ))}
    </Card>
    <Card title="Recent Reviews" theme={theme}>
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewRating}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name="star" size={12} color={i < review.rating ? "#F59E0B" : "#E5E7EB"} />
              ))}
            </View>
            <Text style={[styles.reviewDate, { color: theme.colors.textLight }]}>{review.date}</Text>
          </View>
          <Text style={[styles.reviewComment, { color: theme.colors.text }]}>{review.comment}</Text>
          <Text style={[styles.reviewJobType, { color: theme.colors.textLight }]}>Job: {review.jobType}</Text>
        </View>
      ))}
    </Card>
  </ScrollView>
)

interface ActionButtonsProps {
  status: string
  handleJobAction: (action: "start" | "complete") => void
  handleContactAction: (type: "call" | "message") => void
  handleNavigation: () => void
  theme: any
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  status,
  handleJobAction,
  handleContactAction,
  handleNavigation,
  theme,
}) => (
  <View style={[styles.actionContainer, { backgroundColor: theme.colors.backgroundLight }]}>
    {status === "Accepted" && (
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => handleJobAction("start")}
      >
        <Ionicons name="play" size={20} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Start Job</Text>
      </TouchableOpacity>
    )}
    {status === "In Progress" && (
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: "#10B981" }]}
        onPress={() => handleJobAction("complete")}
      >
        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Complete Job</Text>
      </TouchableOpacity>
    )}
    <View style={styles.secondaryButtons}>
      {[
        { icon: "call", color: "#10B981", action: () => handleContactAction("call") },
        { icon: "chatbubble", color: "#3B82F6", action: () => handleContactAction("message") },
        { icon: "navigate", color: "#8B5CF6", action: handleNavigation },
      ].map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.secondaryButton, { backgroundColor: button.color }]}
          onPress={button.action}
        >
          <Ionicons name={button.icon} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      ))}
    </View>
  </View>
)

interface CardProps {
  title: string
  theme: any
  children: React.ReactNode
  style?: any
}

const Card: React.FC<CardProps> = ({ title, theme, children, style }) => (
  <View style={[styles.card, { backgroundColor: theme.colors.backgroundLight }, style]}>
    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{title}</Text>
    {children}
  </View>
)

interface ListItemProps {
  text: string
  theme: any
  icon?: string
  size?: "small" | "normal"
}

const ListItem: React.FC<ListItemProps> = ({ text, theme, icon, size = "normal" }) => (
  <View style={styles.listItem}>
    {icon ? (
      <Ionicons name={icon} size={14} color={theme.colors.primary} />
    ) : (
      <View style={styles.bulletPoint} />
    )}
    <Text style={[size === "small" ? styles.smallListText : styles.listText, { color: theme.colors.textLight }]}>
      {text}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: { paddingHorizontal: 24 },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { padding: 8, marginRight: 12 },
  headerInfo: { flex: 1 },
  jobId: { fontSize: 12, fontWeight: "500", marginBottom: 2 },
  jobTitle: { fontSize: 18, fontWeight: "700" },
  moreButton: { padding: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  priorityText: { color: "#FFFFFF", fontSize: 10, fontWeight: "600" },
  jobPrice: { fontSize: 20, fontWeight: "700", marginLeft: "auto" },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: { backgroundColor: "rgba(99, 102, 241, 0.1)" },
  tabText: { fontSize: 14, fontWeight: "600" },
  contentContainer: { flex: 1 },
  tabContent: { paddingHorizontal: 24, paddingTop: 20 },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  overviewGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  overviewItem: {
    width: (width - 88) / 2,
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    gap: 8,
  },
  overviewLabel: { fontSize: 12, fontWeight: "500" },
  overviewValue: { fontSize: 14, fontWeight: "600" },
  description: { fontSize: 14, lineHeight: 20 },
  listItem: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#6366F1" },
  listText: { fontSize: 14, flex: 1 },
  smallListText: { fontSize: 12, flex: 1 },
  gridContainer: { flexDirection: "row", gap: 12, marginBottom: 16 },
  halfCard: { flex: 1, borderRadius: 16, padding: 16 },
  instructionsCard: { borderLeftWidth: 4, backgroundColor: "#FEF3C7" },
  instructionsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  instructionsText: { fontSize: 14, lineHeight: 20, color: "#92400E" },
  imagesContainer: { marginTop: 8 },
  imageContainer: { marginRight: 12 },
  jobImage: { width: 120, height: 80, borderRadius: 8 },
  mapContainer: { height: 200, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mapPlaceholderText: { fontSize: 16, fontWeight: "600" },
  mapSubText: { fontSize: 12 },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  navigationButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  addressItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16, gap: 12 },
  addressContent: { flex: 1 },
  addressLabel: { fontSize: 12, fontWeight: "500", marginBottom: 4 },
  addressText: { fontSize: 14, lineHeight: 20 },
  distanceRow: { flexDirection: "row", gap: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(0, 0, 0, 0.1)" },
  distanceItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  distanceText: { fontSize: 12, fontWeight: "500" },
  clientHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  clientAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  clientRating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 14, fontWeight: "500" },
  contactButtons: { flexDirection: "row", gap: 12, marginBottom: 20 },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  contactText: { fontSize: 14, fontWeight: "500" },
  reviewItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "rgba(0, 0, 0, 0.1)" },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  reviewRating: { flexDirection: "row", gap: 2 },
  reviewDate: { fontSize: 12 },
  reviewComment: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  reviewJobType: { fontSize: 12, fontStyle: "italic" },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryButtons: { flexDirection: "row", gap: 8 },
  secondaryButton: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
})

export default JobDetailScreen