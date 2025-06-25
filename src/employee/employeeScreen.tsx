"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
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
  TextInput,
  FlatList,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated"
import { useTheme } from "../contexts/themeContext"

const { width, height } = Dimensions.get("window")

const workerImage = require("../images/man.jpg")

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
  location: {
    area: string
    distance: number
    coordinates: { latitude: number; longitude: number }
  }
  availability: "Available" | "Busy" | "Offline"
  responseTime: string
  verified: boolean
  badges: string[]
  languages: string[]
  emergencyService: boolean
  featured: boolean
  lastActive: Date
  joinedDate: Date
  successRate: number
}

interface FilterOptions {
  categories: string[]
  minRating: number
  maxRating: number
  minPrice: number
  maxPrice: number
  maxDistance: number
  availability: string[]
  badges: string[]
  minExperience: number
  emergencyOnly: boolean
  verifiedOnly: boolean
  languages: string[]
}

const EmployeesScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme, isDark } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid" | "map">("list")
  const [sortBy, setSortBy] = useState<"rating" | "price" | "distance" | "experience">("rating")
  const [showFilters, setShowFilters] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])

  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    minRating: 0,
    maxRating: 5,
    minPrice: 0,
    maxPrice: 2000,
    maxDistance: 50,
    availability: [],
    badges: [],
    minExperience: 0,
    emergencyOnly: false,
    verifiedOnly: false,
    languages: [],
  })

  const employees: Employee[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      profession: "Master Electrician",
      specialties: ["Smart Home Setup", "Solar Installation", "Emergency Repairs"],
      rating: 4.9,
      reviewCount: 247,
      completedJobs: 312,
      yearsExperience: 8,
      hourlyRate: 650,
      profileImage: workerImage,
      location: {
        area: "Central Delhi",
        distance: 2.3,
        coordinates: { latitude: 28.6139, longitude: 77.209 },
      },
      availability: "Available",
      responseTime: "~15 min",
      verified: true,
      badges: ["Top Rated", "Quick Response", "Expert"],
      languages: ["Hindi", "English"],
      emergencyService: true,
      featured: true,
      lastActive: new Date(),
      joinedDate: new Date("2020-03-15"),
      successRate: 98,
    },
    {
      id: "2",
      name: "Amit Singh",
      profession: "Senior Plumber",
      specialties: ["Pipe Installation", "Bathroom Renovation", "Water Heater"],
      rating: 4.7,
      reviewCount: 189,
      completedJobs: 245,
      yearsExperience: 6,
      hourlyRate: 550,
      profileImage: workerImage,
      location: {
        area: "South Delhi",
        distance: 4.1,
        coordinates: { latitude: 28.5244, longitude: 77.1855 },
      },
      availability: "Available",
      responseTime: "~20 min",
      verified: true,
      badges: ["Reliable", "Quality Work"],
      languages: ["Hindi", "English", "Punjabi"],
      emergencyService: true,
      featured: false,
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      joinedDate: new Date("2021-01-20"),
      successRate: 95,
    },
    {
      id: "3",
      name: "Suresh Yadav",
      profession: "AC Technician",
      specialties: ["AC Installation", "Maintenance", "Repair"],
      rating: 4.8,
      reviewCount: 156,
      completedJobs: 198,
      yearsExperience: 5,
      hourlyRate: 500,
      profileImage: workerImage,
      location: {
        area: "East Delhi",
        distance: 6.8,
        coordinates: { latitude: 28.6508, longitude: 77.2773 },
      },
      availability: "Busy",
      responseTime: "~45 min",
      verified: true,
      badges: ["Specialist", "Punctual"],
      languages: ["Hindi"],
      emergencyService: false,
      featured: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinedDate: new Date("2021-08-10"),
      successRate: 92,
    },
    {
      id: "4",
      name: "Manoj Gupta",
      profession: "House Painter",
      specialties: ["Interior Painting", "Exterior Painting", "Wall Design"],
      rating: 4.6,
      reviewCount: 134,
      completedJobs: 167,
      yearsExperience: 7,
      hourlyRate: 400,
      profileImage: workerImage,
      location: {
        area: "West Delhi",
        distance: 8.2,
        coordinates: { latitude: 28.6692, longitude: 77.1114 },
      },
      availability: "Available",
      responseTime: "~30 min",
      verified: false,
      badges: ["Creative", "Detail Oriented"],
      languages: ["Hindi", "English"],
      emergencyService: false,
      featured: false,
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      joinedDate: new Date("2020-11-05"),
      successRate: 89,
    },
    {
      id: "5",
      name: "Vikram Sharma",
      profession: "Carpenter",
      specialties: ["Furniture Making", "Kitchen Cabinets", "Repairs"],
      rating: 4.5,
      reviewCount: 98,
      completedJobs: 123,
      yearsExperience: 4,
      hourlyRate: 450,
      profileImage: workerImage,
      location: {
        area: "North Delhi",
        distance: 12.5,
        coordinates: { latitude: 28.7041, longitude: 77.1025 },
      },
      availability: "Offline",
      responseTime: "~2 hours",
      verified: true,
      badges: ["Craftsman"],
      languages: ["Hindi"],
      emergencyService: false,
      featured: false,
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      joinedDate: new Date("2022-02-14"),
      successRate: 87,
    },
  ]

  const categories = ["Electrician", "Plumber", "AC Technician", "Painter", "Carpenter", "Cleaner", "Gardener"]
  const allBadges = ["Top Rated", "Quick Response", "Expert", "Reliable", "Quality Work", "Specialist", "Punctual"]
  const allLanguages = ["Hindi", "English", "Punjabi", "Bengali", "Tamil"]

  const filteredAndSortedEmployees = useMemo(() => {
    const filtered = employees.filter((employee) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = employee.name.toLowerCase().includes(query)
        const matchesProfession = employee.profession.toLowerCase().includes(query)
        const matchesSpecialties = employee.specialties.some((specialty) => specialty.toLowerCase().includes(query))
        const matchesLocation = employee.location.area.toLowerCase().includes(query)
        if (!matchesName && !matchesProfession && !matchesSpecialties && !matchesLocation) {
          return false
        }
      }

      // Category filter
      if (filters.categories.length > 0) {
        const matchesCategory = filters.categories.some((category) =>
          employee.profession.toLowerCase().includes(category.toLowerCase()),
        )
        if (!matchesCategory) return false
      }

      // Rating filter
      if (employee.rating < filters.minRating || employee.rating > filters.maxRating) {
        return false
      }

      // Price filter
      if (employee.hourlyRate < filters.minPrice || employee.hourlyRate > filters.maxPrice) {
        return false
      }

      // Distance filter
      if (employee.location.distance > filters.maxDistance) {
        return false
      }

      // Availability filter
      if (filters.availability.length > 0 && !filters.availability.includes(employee.availability)) {
        return false
      }

      // Badges filter
      if (filters.badges.length > 0) {
        const hasBadge = filters.badges.some((badge) => employee.badges.includes(badge))
        if (!hasBadge) return false
      }

      // Experience filter
      if (employee.yearsExperience < filters.minExperience) {
        return false
      }

      // Emergency service filter
      if (filters.emergencyOnly && !employee.emergencyService) {
        return false
      }

      // Verified filter
      if (filters.verifiedOnly && !employee.verified) {
        return false
      }

      // Languages filter
      if (filters.languages.length > 0) {
        const speaksLanguage = filters.languages.some((lang) => employee.languages.includes(lang))
        if (!speaksLanguage) return false
      }

      return true
    })

    // Sort employees
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price":
          return a.hourlyRate - b.hourlyRate
        case "distance":
          return a.location.distance - b.location.distance
        case "experience":
          return b.yearsExperience - a.yearsExperience
        default:
          return 0
      }
    })

    // Featured employees first
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
  }, [searchQuery, filters, sortBy])

  const toggleFavorite = (employeeId: string) => {
    setFavorites((prev) => (prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId]))
  }

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      minRating: 0,
      maxRating: 5,
      minPrice: 0,
      maxPrice: 2000,
      maxDistance: 50,
      availability: [],
      badges: [],
      minExperience: 0,
      emergencyOnly: false,
      verifiedOnly: false,
      languages: [],
    })
    setSearchQuery("")
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.minRating > 0) count++
    if (filters.maxRating < 5) count++
    if (filters.minPrice > 0) count++
    if (filters.maxPrice < 2000) count++
    if (filters.maxDistance < 50) count++
    if (filters.availability.length > 0) count++
    if (filters.badges.length > 0) count++
    if (filters.minExperience > 0) count++
    if (filters.emergencyOnly) count++
    if (filters.verifiedOnly) count++
    if (filters.languages.length > 0) count++
    return count
  }

  const QuickFilterChip = ({
    title,
    isActive,
    onPress,
    icon,
  }: {
    title: string
    isActive: boolean
    onPress: () => void
    icon?: string
  }) => {
    const scaleAnim = useSharedValue(1)

    const handlePress = () => {
      scaleAnim.value = withSpring(0.95, { damping: 15 }, () => {
        scaleAnim.value = withSpring(1, { damping: 15 })
      })
      onPress()
    }

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }))

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.quickFilterChip,
            {
              backgroundColor: isActive ? theme.colors.primary : theme.colors.backgroundSoft,
              borderColor: isActive ? theme.colors.primary : theme.colors.border,
            },
            animatedStyle,
          ]}
        >
          {icon && (
            <Ionicons
              name={icon as any}
              size={16}
              color={isActive ? theme.colors.background : theme.colors.textLight}
            />
          )}
          <Text
            style={[styles.quickFilterText, { color: isActive ? theme.colors.background : theme.colors.textLight }]}
          >
            {title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const EmployeeCard = ({ employee, index }: { employee: Employee; index: number }) => {
    const fadeAnim = useSharedValue(0)
    const slideAnim = useSharedValue(50)

    useEffect(() => {
      fadeAnim.value = withDelay(index * 100, withTiming(1, { duration: 600 }))
      slideAnim.value = withDelay(index * 100, withSpring(0, { damping: 20, stiffness: 90 }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    }))

    const getAvailabilityColor = (availability: string) => {
      switch (availability) {
        case "Available":
          return theme.colors.success
        case "Busy":
          return theme.colors.warning
        case "Offline":
          return theme.colors.textLighter
        default:
          return theme.colors.textLighter
      }
    }

    const handleEmployeePress = () => {
      setRecentlyViewed((prev) => [employee.id, ...prev.filter((id) => id !== employee.id)].slice(0, 5))
      // Navigate to employee details
      // navigation.navigate('EmployeeDetails', { employeeId: employee.id })
    }

    return (
      <Animated.View
        style={[
          viewMode === "grid" ? styles.gridEmployeeCard : styles.listEmployeeCard,
          { backgroundColor: theme.colors.backgroundLight },
          animatedStyle,
        ]}
      >
        <TouchableOpacity onPress={handleEmployeePress} activeOpacity={0.95}>
          {employee.featured && (
            <View style={[styles.featuredBadge, { backgroundColor: theme.colors.warning }]}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.featuredText}>FEATURED</Text>
            </View>
          )}

          <View style={styles.employeeCardHeader}>
            <View style={styles.employeeImageContainer}>
              <Image source={employee.profileImage} style={styles.employeeImage} />
              <View
                style={[styles.availabilityDot, { backgroundColor: getAvailabilityColor(employee.availability) }]}
              />
              {employee.verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              )}
            </View>

            <View style={styles.employeeInfo}>
              <Text style={[styles.employeeName, { color: theme.colors.text }]} numberOfLines={1}>
                {employee.name}
              </Text>
              <Text style={[styles.employeeProfession, { color: theme.colors.textLight }]} numberOfLines={1}>
                {employee.profession}
              </Text>

              <View style={styles.employeeMetaRow}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={theme.colors.warning} />
                  <Text style={[styles.ratingText, { color: theme.colors.textLight }]}>{employee.rating}</Text>
                  <Text style={[styles.reviewCount, { color: theme.colors.textLighter }]}>
                    ({employee.reviewCount})
                  </Text>
                </View>
                <Text style={[styles.experienceText, { color: theme.colors.textLighter }]}>
                  {employee.yearsExperience}y exp
                </Text>
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={theme.colors.textLighter} />
                <Text style={[styles.locationText, { color: theme.colors.textLighter }]} numberOfLines={1}>
                  {employee.location.area} • {employee.location.distance}km
                </Text>
              </View>
            </View>

            <View style={styles.employeeActions}>
              <TouchableOpacity
                onPress={() => toggleFavorite(employee.id)}
                style={[
                  styles.favoriteButton,
                  {
                    backgroundColor: favorites.includes(employee.id) ? theme.colors.error : theme.colors.backgroundSoft,
                  },
                ]}
              >
                <Ionicons
                  name={favorites.includes(employee.id) ? "heart" : "heart-outline"}
                  size={16}
                  color={favorites.includes(employee.id) ? "#FFFFFF" : theme.colors.textLight}
                />
              </TouchableOpacity>
              <Text style={[styles.priceText, { color: theme.colors.text }]}>₹{employee.hourlyRate}</Text>
              <Text style={[styles.priceUnit, { color: theme.colors.textLighter }]}>/hr</Text>
            </View>
          </View>

          {viewMode === "list" && (
            <>
              <View style={styles.specialtiesContainer}>
                {employee.specialties.slice(0, 2).map((specialty, idx) => (
                  <View key={idx} style={[styles.specialtyChip, { backgroundColor: theme.colors.backgroundSoft }]}>
                    <Text style={[styles.specialtyText, { color: theme.colors.textLight }]}>{specialty}</Text>
                  </View>
                ))}
                {employee.specialties.length > 2 && (
                  <Text style={[styles.moreSpecialties, { color: theme.colors.textLighter }]}>
                    +{employee.specialties.length - 2} more
                  </Text>
                )}
              </View>

              <View style={styles.badgesContainer}>
                {employee.badges.slice(0, 3).map((badge, idx) => (
                  <View key={idx} style={[styles.badgeChip, { backgroundColor: `${theme.colors.primary}15` }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{badge}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.responseTimeContainer}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.textLighter} />
                  <Text style={[styles.responseTimeText, { color: theme.colors.textLighter }]}>
                    Responds {employee.responseTime}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSoft }]}>
                    <Ionicons name="chatbubble-outline" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSoft }]}>
                    <Ionicons name="call" size={16} color={theme.colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bookButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.bookButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {viewMode === "grid" && (
            <View style={styles.gridCardFooter}>
              <TouchableOpacity style={[styles.gridBookButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.gridBookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Selection checkbox for comparison */}
        <TouchableOpacity
          style={styles.selectionCheckbox}
          onPress={() => toggleEmployeeSelection(employee.id)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: selectedEmployees.includes(employee.id) ? theme.colors.primary : "transparent",
                borderColor: selectedEmployees.includes(employee.id) ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            {selectedEmployees.includes(employee.id) && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const FilterModal = () => {
    const modalFade = useSharedValue(0)
    const modalSlide = useSharedValue(height)

    useEffect(() => {
      if (showFilters) {
        modalFade.value = withTiming(1, { duration: 300 })
        modalSlide.value = withSpring(0, { damping: 25, stiffness: 120 })
      } else {
        modalFade.value = withTiming(0, { duration: 200 })
        modalSlide.value = withTiming(height, { duration: 200 })
      }
    }, [showFilters])

    const animatedModalStyle = useAnimatedStyle(() => ({
      opacity: modalFade.value,
      transform: [{ translateY: modalSlide.value }],
    }))

    const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
      <View style={styles.filterSection}>
        <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>{title}</Text>
        {children}
      </View>
    )

    const FilterChip = ({
      title,
      isSelected,
      onPress,
    }: {
      title: string
      isSelected: boolean
      onPress: () => void
    }) => (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View
          style={[
            styles.filterChip,
            {
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.backgroundSoft,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.filterChipText, { color: isSelected ? "#FFFFFF" : theme.colors.textLight }]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    )

    return (
      <Modal visible={showFilters} animationType="none" transparent>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.filterModalContainer, { backgroundColor: theme.colors.background }, animatedModalStyle]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <View style={[styles.modalHandle, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              <FilterSection title="Categories">
                <View style={styles.filterChipsContainer}>
                  {categories.map((category) => (
                    <FilterChip
                      key={category}
                      title={category}
                      isSelected={filters.categories.includes(category)}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          categories: prev.categories.includes(category)
                            ? prev.categories.filter((c) => c !== category)
                            : [...prev.categories, category],
                        }))
                      }
                    />
                  ))}
                </View>
              </FilterSection>

              <FilterSection title="Availability">
                <View style={styles.filterChipsContainer}>
                  {["Available", "Busy", "Offline"].map((status) => (
                    <FilterChip
                      key={status}
                      title={status}
                      isSelected={filters.availability.includes(status)}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          availability: prev.availability.includes(status)
                            ? prev.availability.filter((s) => s !== status)
                            : [...prev.availability, status],
                        }))
                      }
                    />
                  ))}
                </View>
              </FilterSection>

              <FilterSection title="Badges">
                <View style={styles.filterChipsContainer}>
                  {allBadges.map((badge) => (
                    <FilterChip
                      key={badge}
                      title={badge}
                      isSelected={filters.badges.includes(badge)}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          badges: prev.badges.includes(badge)
                            ? prev.badges.filter((b) => b !== badge)
                            : [...prev.badges, badge],
                        }))
                      }
                    />
                  ))}
                </View>
              </FilterSection>

              <FilterSection title="Languages">
                <View style={styles.filterChipsContainer}>
                  {allLanguages.map((language) => (
                    <FilterChip
                      key={language}
                      title={language}
                      isSelected={filters.languages.includes(language)}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          languages: prev.languages.includes(language)
                            ? prev.languages.filter((l) => l !== language)
                            : [...prev.languages, language],
                        }))
                      }
                    />
                  ))}
                </View>
              </FilterSection>

              <FilterSection title="Special Options">
                <View style={styles.toggleOptions}>
                  <TouchableOpacity
                    style={styles.toggleOption}
                    onPress={() => setFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                  >
                    <View
                      style={[
                        styles.toggleCheckbox,
                        {
                          backgroundColor: filters.verifiedOnly ? theme.colors.primary : "transparent",
                          borderColor: filters.verifiedOnly ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                    >
                      {filters.verifiedOnly && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Verified Only</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toggleOption}
                    onPress={() => setFilters((prev) => ({ ...prev, emergencyOnly: !prev.emergencyOnly }))}
                  >
                    <View
                      style={[
                        styles.toggleCheckbox,
                        {
                          backgroundColor: filters.emergencyOnly ? theme.colors.primary : "transparent",
                          borderColor: filters.emergencyOnly ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                    >
                      {filters.emergencyOnly && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Emergency Service</Text>
                  </TouchableOpacity>
                </View>
              </FilterSection>
            </ScrollView>

            <View style={[styles.filterFooter, { borderTopColor: theme.colors.border }]}>
              <TouchableOpacity
                style={[styles.clearFiltersButton, { backgroundColor: theme.colors.backgroundSoft }]}
                onPress={clearAllFilters}
              >
                <Text style={[styles.clearFiltersText, { color: theme.colors.textLight }]}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyFiltersButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    )
  }

  const SortModal = () => (
    <Modal visible={showSortModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.sortModalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sort By</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.sortOptions}>
            {[
              { key: "rating", label: "Highest Rated", icon: "star" },
              { key: "price", label: "Lowest Price", icon: "cash" },
              { key: "distance", label: "Nearest", icon: "location" },
              { key: "experience", label: "Most Experienced", icon: "school" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  { backgroundColor: sortBy === option.key ? theme.colors.primarySoft : "transparent" },
                ]}
                onPress={() => {
                  setSortBy(option.key as any)
                  setShowSortModal(false)
                }}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={sortBy === option.key ? theme.colors.primary : theme.colors.textLight}
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    { color: sortBy === option.key ? theme.colors.primary : theme.colors.text },
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.key && <Ionicons name="checkmark" size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            ))}
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
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Find Professionals</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textLight }]}>
            {filteredAndSortedEmployees.length} professionals available
          </Text>
        </View>
      </SafeAreaView>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.backgroundLight }]}>
          <Ionicons name="search" size={20} color={theme.colors.textLighter} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search by name, profession, or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textLighter}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textLighter} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Filters */}
      <View style={styles.quickFiltersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersContent}
        >
          <QuickFilterChip
            title="Available Now"
            isActive={filters.availability.includes("Available")}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                availability: prev.availability.includes("Available") ? [] : ["Available"],
              }))
            }
            icon="checkmark-circle"
          />
          <QuickFilterChip
            title="Top Rated"
            isActive={filters.minRating >= 4.5}
            onPress={() => setFilters((prev) => ({ ...prev, minRating: prev.minRating >= 4.5 ? 0 : 4.5 }))}
            icon="star"
          />
          <QuickFilterChip
            title="Verified"
            isActive={filters.verifiedOnly}
            onPress={() => setFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
            icon="shield-checkmark"
          />
          <QuickFilterChip
            title="Emergency"
            isActive={filters.emergencyOnly}
            onPress={() => setFilters((prev) => ({ ...prev, emergencyOnly: !prev.emergencyOnly }))}
            icon="flash"
          />
          <QuickFilterChip
            title="Nearby"
            isActive={filters.maxDistance <= 10}
            onPress={() => setFilters((prev) => ({ ...prev, maxDistance: prev.maxDistance <= 10 ? 50 : 10 }))}
            icon="location"
          />
        </ScrollView>
      </View>

      {/* Controls Bar */}
      <View style={[styles.controlsBar, { backgroundColor: theme.colors.backgroundLight }]}>
        <TouchableOpacity
          style={[styles.filterButton, getActiveFiltersCount() > 0 && { backgroundColor: theme.colors.primarySoft }]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons
            name="options"
            size={20}
            color={getActiveFiltersCount() > 0 ? theme.colors.primary : theme.colors.textLight}
          />
          <Text
            style={[
              styles.filterButtonText,
              { color: getActiveFiltersCount() > 0 ? theme.colors.primary : theme.colors.textLight },
            ]}
          >
            Filters
          </Text>
          {getActiveFiltersCount() > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortModal(true)}>
          <Ionicons name="swap-vertical" size={20} color={theme.colors.textLight} />
          <Text style={[styles.sortButtonText, { color: theme.colors.textLight }]}>Sort</Text>
        </TouchableOpacity>

        <View style={styles.viewModeToggle}>
          {["list", "grid", "map"].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.viewModeButton, viewMode === mode && { backgroundColor: theme.colors.primary }]}
              onPress={() => setViewMode(mode as any)}
            >
              <Ionicons
                name={mode === "list" ? "list" : mode === "grid" ? "grid" : "map"}
                size={18}
                color={viewMode === mode ? "#FFFFFF" : theme.colors.textLight}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Comparison Bar */}
      {selectedEmployees.length > 0 && (
        <View style={[styles.comparisonBar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.comparisonText}>{selectedEmployees.length} selected for comparison</Text>
          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => setShowComparison(true)}
            disabled={selectedEmployees.length < 2}
          >
            <Text style={[styles.compareButtonText, { opacity: selectedEmployees.length < 2 ? 0.5 : 1 }]}>Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedEmployees([])}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Employees List */}
      <FlatList
        data={filteredAndSortedEmployees}
        renderItem={({ item, index }) => <EmployeeCard employee={item} index={index} />}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={[styles.employeesList, viewMode === "grid" && styles.gridEmployeesList]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={theme.colors.textLighter} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No professionals found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textLight }]}>
              Try adjusting your search criteria or filters
            </Text>
            <TouchableOpacity
              style={[styles.clearFiltersButton, { backgroundColor: theme.colors.primary }]}
              onPress={clearAllFilters}
            >
              <Text style={[styles.clearFiltersText, { color: "#FFFFFF" }]}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <FilterModal />
      <SortModal />
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
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  quickFiltersSection: {
    marginBottom: 16,
  },
  quickFiltersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  quickFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    position: "relative",
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  controlsBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    position: "relative",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    marginLeft: 12,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  viewModeToggle: {
    flexDirection: "row",
    marginLeft: "auto",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 2,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 10,
  },
  comparisonBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
  },
  comparisonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  compareButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginRight: 12,
  },
  compareButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  employeesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridEmployeesList: {
    paddingHorizontal: 16,
  },
  listEmployeeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  gridEmployeeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    margin: 4,
    flex: 1,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    zIndex: 1,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  employeeCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  employeeImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  employeeImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  availabilityDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  verifiedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  employeeProfession: {
    fontSize: 14,
    marginBottom: 8,
  },
  employeeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
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
  experienceText: {
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  employeeActions: {
    alignItems: "flex-end",
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
  },
  priceUnit: {
    fontSize: 12,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  specialtyChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  moreSpecialties: {
    fontSize: 12,
    alignSelf: "center",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 6,
  },
  badgeChip: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  responseTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  responseTimeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  bookButton: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  gridCardFooter: {
    marginTop: 12,
  },
  gridBookButton: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  gridBookButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  selectionCheckbox: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 24,
  },
  clearFiltersButton: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  filterModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
  },
  sortModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
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
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggleOptions: {
    gap: 16,
  },
  toggleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 16,
  },
  filterFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  applyFiltersButton: {
    flex: 2,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sortOptions: {
    padding: 20,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  sortOptionText: {
    flex: 1,
    fontSize: 16,
  },
})

export default EmployeesScreen
