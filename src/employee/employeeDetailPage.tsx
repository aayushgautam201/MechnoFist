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
const HEADER_HEIGHT = 300

const workerImage = require("../images/man.jpg")

interface Skill {
  name: string
  level: number
  icon: string
}

interface Review {
  id: string
  clientName: string
  rating: number
  comment: string
  date: Date
  projectType: string
}

interface Portfolio {
  id: string
  title: string
  description: string
  images: string[]
  completedDate: Date
  rating: number
  price: number
}

interface Employee {
  id: string
  name: string
  profession: string
  specialties: string[]
  rating: number
  reviewCount: number
  completedJobs: number
  yearsExperience: number
  hourlyRate: number
  profileImage: any
  coverImage?: string
  location: string
  responseTime: string
  availability: "Available" | "Busy" | "Offline"
  bio: string
  skills: Skill[]
  reviews: Review[]
  portfolio: Portfolio[]
  verified: boolean
  badges: string[]
  languages: string[]
  workingHours: string
  emergencyService: boolean
}

const EmployeeDetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme, isDark, toggleTheme } = useTheme();
  const scrollY = useSharedValue(0)
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "portfolio">("about")
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const employee: Employee = {
    id: "EMP001",
    name: "Rajesh Kumar",
    profession: "Master Electrician",
    specialties: ["Smart Home Setup", "Solar Installation", "Emergency Repairs"],
    rating: 4.9,
    reviewCount: 247,
    completedJobs: 312,
    yearsExperience: 8,
    hourlyRate: 650,
    profileImage: workerImage,
    location: "Central Delhi",
    responseTime: "~15 min",
    availability: "Available",
    bio: "Experienced master electrician specializing in modern electrical systems and smart home installations. Committed to delivering safe, efficient, and innovative electrical solutions for residential and commercial properties.",
    skills: [
      { name: "Electrical Wiring", level: 5, icon: "flash" },
      { name: "Smart Home Systems", level: 4, icon: "home" },
      { name: "Solar Installation", level: 4, icon: "sunny" },
      { name: "Emergency Repairs", level: 5, icon: "build" },
      { name: "Safety Protocols", level: 5, icon: "shield-checkmark" },
    ],
    reviews: [
      {
        id: "1",
        clientName: "Priya Sharma",
        rating: 5,
        comment: "Excellent work! Very professional and completed the smart home setup perfectly.",
        date: new Date("2024-01-15"),
        projectType: "Smart Home Installation",
      },
      {
        id: "2",
        clientName: "Amit Singh",
        rating: 5,
        comment: "Quick response for emergency repair. Highly recommended!",
        date: new Date("2024-01-10"),
        projectType: "Emergency Repair",
      },
      {
        id: "3",
        clientName: "Neha Gupta",
        rating: 4,
        comment: "Good work on solar panel installation. Very knowledgeable about renewable energy.",
        date: new Date("2024-01-05"),
        projectType: "Solar Installation",
      },
    ],
    portfolio: [
      {
        id: "1",
        title: "Modern Smart Home Setup",
        description: "Complete smart home automation with voice control and mobile app integration",
        images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
        completedDate: new Date("2024-01-15"),
        rating: 5,
        price: 45000,
      },
      {
        id: "2",
        title: "Solar Panel Installation",
        description: "5KW solar panel system with battery backup and grid connection",
        images: ["/placeholder.svg?height=200&width=300"],
        completedDate: new Date("2024-01-05"),
        rating: 4,
        price: 85000,
      },
    ],
    verified: true,
    badges: ["Top Rated", "Quick Response", "Verified Pro"],
    languages: ["Hindi", "English"],
    workingHours: "8:00 AM - 8:00 PM",
    emergencyService: true,
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

  const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
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

    return (
      <Animated.View style={[styles.skillCard, { backgroundColor: theme.colors.backgroundLight }, animatedStyle]}>
        <View style={[styles.skillIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
          <Ionicons name={skill.icon as any} size={20} color={theme.colors.primary} />
        </View>
        <Text style={[styles.skillName, { color: theme.colors.text }]}>{skill.name}</Text>
        <View style={styles.skillLevel}>
          {[1, 2, 3, 4, 5].map((level) => (
            <View
              key={level}
              style={[
                styles.skillDot,
                {
                  backgroundColor: level <= skill.level ? theme.colors.primary : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    )
  }

  const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
    const fadeAnim = useSharedValue(0)

    useEffect(() => {
      fadeAnim.value = withDelay(index * 150, withTiming(1, { duration: 600 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
    }))

    return (
      <Animated.View style={[styles.reviewCard, { backgroundColor: theme.colors.backgroundLight }, animatedStyle]}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <Text style={[styles.reviewerName, { color: theme.colors.text }]}>{review.clientName}</Text>
            <Text style={[styles.reviewDate, { color: theme.colors.textLighter }]}>
              {review.date.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={14}
                color={star <= review.rating ? theme.colors.warning : theme.colors.border}
              />
            ))}
          </View>
        </View>
        <Text style={[styles.reviewComment, { color: theme.colors.textLight }]}>{review.comment}</Text>
        <Text style={[styles.reviewProject, { color: theme.colors.primary }]}>{review.projectType}</Text>
      </Animated.View>
    )
  }

  const PortfolioCard = ({ item, index }: { item: Portfolio; index: number }) => {
    const fadeAnim = useSharedValue(0)
    const slideAnim = useSharedValue(50)

    useEffect(() => {
      fadeAnim.value = withDelay(index * 200, withTiming(1, { duration: 800 }))
      slideAnim.value = withDelay(index * 200, withSpring(0, { damping: 20, stiffness: 90 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    }))

    return (
      <Animated.View style={[styles.portfolioCard, { backgroundColor: theme.colors.backgroundLight }, animatedStyle]}>
        <TouchableOpacity
          onPress={() => {
            setSelectedImage(item.images[0])
            setShowImageModal(true)
          }}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.images[0] }} style={styles.portfolioImage} />
        </TouchableOpacity>
        <View style={styles.portfolioContent}>
          <Text style={[styles.portfolioTitle, { color: theme.colors.text }]}>{item.title}</Text>
          <Text style={[styles.portfolioDescription, { color: theme.colors.textLight }]}>{item.description}</Text>
          <View style={styles.portfolioFooter}>
            <View style={styles.portfolioRating}>
              <Ionicons name="star" size={16} color={theme.colors.warning} />
              <Text style={[styles.portfolioRatingText, { color: theme.colors.textLight }]}>{item.rating}</Text>
            </View>
            <Text style={[styles.portfolioPrice, { color: theme.colors.primary }]}>₹{item.price.toLocaleString()}</Text>
          </View>
        </View>
      </Animated.View>
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
      case "about":
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
              <Text style={[styles.bioText, { color: theme.colors.textLight }]}>{employee.bio}</Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills & Expertise</Text>
              <View style={styles.skillsGrid}>
                {employee.skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Languages</Text>
              <View style={styles.languagesContainer}>
                {employee.languages.map((language) => (
                  <View key={language} style={[styles.languageChip, { backgroundColor: theme.colors.backgroundSoft }]}>
                    <Text style={[styles.languageText, { color: theme.colors.text }]}>{language}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Working Hours</Text>
              <View style={[styles.infoCard, { backgroundColor: theme.colors.backgroundLight }]}>
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.infoText, { color: theme.colors.textLight }]}>{employee.workingHours}</Text>
              </View>
              {employee.emergencyService && (
                <View style={[styles.infoCard, { backgroundColor: theme.colors.backgroundLight }]}>
                  <Ionicons name="flash" size={20} color={theme.colors.warning} />
                  <Text style={[styles.infoText, { color: theme.colors.textLight }]}>24/7 Emergency Service</Text>
                </View>
              )}
            </View>
          </View>
        )

      case "reviews":
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewsHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Customer Reviews</Text>
              <View style={[styles.ratingOverview, { backgroundColor: theme.colors.backgroundLight }]}>
                <Text style={[styles.overallRating, { color: theme.colors.text }]}>{employee.rating}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={16}
                      color={star <= Math.floor(employee.rating) ? theme.colors.warning : theme.colors.border}
                    />
                  ))}
                </View>
                <Text style={[styles.reviewCountText, { color: theme.colors.textLight }]}>
                  {employee.reviewCount} reviews
                </Text>
              </View>
            </View>
            {employee.reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </View>
        )

      case "portfolio":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Work</Text>
            {employee.portfolio.map((item, index) => (
              <PortfolioCard key={item.id} item={item} index={index} />
            ))}
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
      <View style={[styles.animatedHeader, { backgroundColor: theme.colors.background }, ]}>
        <SafeAreaView style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{employee.name}</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color={theme.colors.text} />
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
          <Animated.View style={[styles.profileImageContainer, imageAnimatedStyle]}>
            <Image source={employee.profileImage} style={styles.profileImage} />
            <View
              style={[
                styles.availabilityIndicator,
                {
                  backgroundColor:
                    employee.availability === "Available"
                      ? theme.colors.success
                      : employee.availability === "Busy"
                        ? theme.colors.warning
                        : theme.colors.textLighter,
                },
              ]}
            />
          </Animated.View>

          <Animated.View style={[styles.profileInfo, contentAnimatedStyle]}>
            <View style={styles.nameContainer}>
              <Text style={[styles.employeeName, { color: theme.colors.text }]}>{employee.name}</Text>
              {employee.verified && <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />}
            </View>
            <Text style={[styles.profession, { color: theme.colors.textLight }]}>{employee.profession}</Text>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color={theme.colors.warning} />
              <Text style={[styles.ratingText, { color: theme.colors.text }]}>{employee.rating}</Text>
              <Text style={[styles.reviewCount, { color: theme.colors.textLight }]}>({employee.reviewCount})</Text>
            </View>

            <View style={styles.badgesContainer}>
              {employee.badges.map((badge) => (
                <View key={badge} style={[styles.badge, { backgroundColor: theme.colors.primarySoft }]}>
                  <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{badge}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Stats Section */}
        <Animated.View style={[styles.statsSection, contentAnimatedStyle]}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.backgroundLight }]}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{employee.completedJobs}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Jobs Done</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.backgroundLight }]}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{employee.yearsExperience}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Years Exp</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.backgroundLight }]}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>₹{employee.hourlyRate}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Per Hour</Text>
          </View>
        </Animated.View>

        {/* Quick Info */}
        <Animated.View style={[styles.quickInfoSection, contentAnimatedStyle]}>
          <View style={[styles.quickInfoCard, { backgroundColor: theme.colors.backgroundLight }]}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.quickInfoText, { color: theme.colors.textLight }]}>{employee.location}</Text>
          </View>
          <View style={[styles.quickInfoCard, { backgroundColor: theme.colors.backgroundLight }]}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.quickInfoText, { color: theme.colors.textLight }]}>
              Responds {employee.responseTime}
            </Text>
          </View>
        </Animated.View>

        {/* Specialties */}
        <Animated.View style={[styles.specialtiesSection, contentAnimatedStyle]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {employee.specialties.map((specialty) => (
              <View key={specialty} style={[styles.specialtyChip, { backgroundColor: theme.colors.backgroundSoft }]}>
                <Text style={[styles.specialtyText, { color: theme.colors.text }]}>{specialty}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Tabs */}
        <Animated.View style={[styles.tabsContainer, contentAnimatedStyle]}>
          <TabButton title="About" isActive={activeTab === "about"} onPress={() => setActiveTab("about")} />
          <TabButton title="Reviews" isActive={activeTab === "reviews"} onPress={() => setActiveTab("reviews")} />
          <TabButton title="Portfolio" isActive={activeTab === "portfolio"} onPress={() => setActiveTab("portfolio")} />
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
          <Ionicons name="chatbubble-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.backgroundLight }]}>
          <Ionicons name="call" size={24} color={theme.colors.success} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <Modal visible={showImageModal} animationType="fade" transparent>
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity style={styles.imageModalClose} onPress={() => setShowImageModal(false)}>
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
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
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
    paddingTop:20
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  availabilityIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  employeeName: {
    fontSize: 28,
    fontWeight: "700",
    marginRight: 8,
  },
  profession: {
    fontSize: 16,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  badge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  quickInfoSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  quickInfoCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  quickInfoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  specialtiesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: "500",
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
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  skillCard: {
    width: (width - 64) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  skillIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  skillLevel: {
    flexDirection: "row",
    gap: 4,
  },
  skillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  languagesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  languageChip: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
  },
  reviewsHeader: {
    marginBottom: 24,
  },
  ratingOverview: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  overallRating: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 4,
  },
  reviewCountText: {
    fontSize: 14,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewProject: {
    fontSize: 14,
    fontWeight: "500",
  },
  portfolioCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  portfolioImage: {
    width: "100%",
    height: 200,
  },
  portfolioContent: {
    padding: 16,
  },
  portfolioTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  portfolioDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  portfolioFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  portfolioRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  portfolioRatingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  portfolioPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookButton: {
    flex: 1,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 16,
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
  fullScreenImage: {
    width: width - 40,
    height: height - 200,
  },
})

export default EmployeeDetailsScreen
