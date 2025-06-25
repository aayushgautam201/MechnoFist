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
  TextInput,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated"
import { useTheme } from "../contexts/themeContext"

const { width, height } = Dimensions.get("window")

const workerImage = require("../images/man.jpg")

interface Service {
  id: string
  name: string
  description: string
  basePrice: number
  duration: number // in hours
  category: string
  popular: boolean
  icon: string
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
  price?: number // surge pricing
}

interface BookingDetails {
  employeeId: string
  services: string[]
  date: Date
  timeSlot: string
  duration: number
  location: {
    type: "current" | "custom"
    address: string
    coordinates?: { latitude: number; longitude: number }
    instructions?: string
  }
  urgency: "normal" | "urgent" | "emergency"
  notes: string
  recurring?: {
    enabled: boolean
    frequency: "weekly" | "biweekly" | "monthly"
    endDate?: Date
  }
  pricing: {
    serviceTotal: number
    urgencyFee: number
    platformFee: number
    taxes: number
    discount: number
    total: number
  }
  paymentMethod: "cash" | "card" | "upi" | "wallet"
}

const EmployeeBookingScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme, isDark } = useTheme()
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const progressAnim = useSharedValue(0)

  // Employee data (would come from navigation params)
  const employee = {
    id: "1",
    name: "Rajesh Kumar",
    profession: "Master Electrician",
    rating: 4.9,
    reviewCount: 247,
    profileImage: workerImage,
    responseTime: "~15 min",
    verified: true,
    location: "Central Delhi",
    hourlyRate: 650,
  }

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    employeeId: employee.id,
    services: [],
    date: new Date(),
    timeSlot: "",
    duration: 0,
    location: {
      type: "current",
      address: "Connaught Place, New Delhi",
    },
    urgency: "normal",
    notes: "",
    pricing: {
      serviceTotal: 0,
      urgencyFee: 0,
      platformFee: 0,
      taxes: 0,
      discount: 0,
      total: 0,
    },
    paymentMethod: "upi",
  })

  const services: Service[] = [
    {
      id: "1",
      name: "Basic Electrical Repair",
      description: "Switch, socket, and basic wiring repairs",
      basePrice: 500,
      duration: 1,
      category: "Repair",
      popular: true,
      icon: "flash",
    },
    {
      id: "2",
      name: "Smart Home Setup",
      description: "Smart switches, automation, and IoT device installation",
      basePrice: 1200,
      duration: 3,
      category: "Installation",
      popular: true,
      icon: "home",
    },
    {
      id: "3",
      name: "Ceiling Fan Installation",
      description: "Complete ceiling fan installation with wiring",
      basePrice: 800,
      duration: 2,
      category: "Installation",
      popular: false,
      icon: "refresh",
    },
    {
      id: "4",
      name: "Emergency Electrical Fix",
      description: "Urgent electrical issues and power outages",
      basePrice: 1000,
      duration: 1.5,
      category: "Emergency",
      popular: false,
      icon: "warning",
    },
    {
      id: "5",
      name: "Complete House Wiring",
      description: "Full house electrical wiring and panel setup",
      basePrice: 5000,
      duration: 8,
      category: "Major Work",
      popular: false,
      icon: "construct",
    },
  ]

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "09:00 AM", available: true },
    { id: "2", time: "10:00 AM", available: true },
    { id: "3", time: "11:00 AM", available: false },
    { id: "4", time: "12:00 PM", available: true },
    { id: "5", time: "01:00 PM", available: true },
    { id: "6", time: "02:00 PM", available: true, price: 50 }, // surge pricing
    { id: "7", time: "03:00 PM", available: true, price: 50 },
    { id: "8", time: "04:00 PM", available: true },
    { id: "9", time: "05:00 PM", available: false },
    { id: "10", time: "06:00 PM", available: true },
  ]

  useEffect(() => {
    progressAnim.value = withTiming((currentStep / 4) * 100, { duration: 500 })
  }, [currentStep])

  useEffect(() => {
    calculatePricing()
  }, [bookingDetails.services, bookingDetails.urgency])

  const calculatePricing = () => {
    const selectedServices = services.filter((service) => bookingDetails.services.includes(service.id))
    const serviceTotal = selectedServices.reduce((total, service) => total + service.basePrice, 0)
    const totalDuration = selectedServices.reduce((total, service) => total + service.duration, 0)

    let urgencyFee = 0
    if (bookingDetails.urgency === "urgent") urgencyFee = serviceTotal * 0.2
    if (bookingDetails.urgency === "emergency") urgencyFee = serviceTotal * 0.5

    const platformFee = Math.max(50, serviceTotal * 0.05)
    const taxes = (serviceTotal + urgencyFee + platformFee) * 0.18
    const discount = 0 // Could be applied based on promotions
    const total = serviceTotal + urgencyFee + platformFee + taxes - discount

    setBookingDetails((prev) => ({
      ...prev,
      duration: totalDuration,
      pricing: {
        serviceTotal,
        urgencyFee,
        platformFee,
        taxes: Math.round(taxes),
        discount,
        total: Math.round(total),
      },
    }))
  }

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value}%`,
  }))

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleBookingConfirm()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBookingConfirm = () => {
    setShowConfirmation(true)
    // Here you would typically send the booking data to your backend
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingDetails.services.length > 0
      case 2:
        return bookingDetails.timeSlot !== ""
      case 3:
        return bookingDetails.location.address !== ""
      case 4:
        return true
      default:
        return false
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

  const StepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={[styles.progressBar, { backgroundColor: theme.colors.backgroundSoft }]}>
        <Animated.View
          style={[styles.progressFill, { backgroundColor: theme.colors.primary }, progressAnimatedStyle]}
        />
      </View>
      <View style={styles.stepLabels}>
        {["Services", "Schedule", "Details", "Payment"].map((label, index) => (
          <View key={index} style={styles.stepLabel}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: index + 1 <= currentStep ? theme.colors.primary : theme.colors.backgroundSoft,
                },
              ]}
            >
              <Text
                style={[styles.stepNumber, { color: index + 1 <= currentStep ? "#FFFFFF" : theme.colors.textLighter }]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabelText,
                { color: index + 1 <= currentStep ? theme.colors.primary : theme.colors.textLighter },
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )

  const EmployeeHeader = () => (
    <View style={[styles.employeeHeader, { backgroundColor: theme.colors.backgroundLight }]}>
      <Image source={employee.profileImage} style={styles.employeeAvatar} />
      <View style={styles.employeeInfo}>
        <View style={styles.employeeNameRow}>
          <Text style={[styles.employeeName, { color: theme.colors.text }]}>{employee.name}</Text>
          {employee.verified && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
        </View>
        <Text style={[styles.employeeProfession, { color: theme.colors.textLight }]}>{employee.profession}</Text>
        <View style={styles.employeeMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <Text style={[styles.ratingText, { color: theme.colors.textLight }]}>{employee.rating}</Text>
            <Text style={[styles.reviewCount, { color: theme.colors.textLighter }]}>({employee.reviewCount})</Text>
          </View>
          <Text style={[styles.responseTime, { color: theme.colors.textLighter }]}>
            Responds {employee.responseTime}
          </Text>
        </View>
      </View>
      <View style={styles.employeeActions}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSoft }]}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.backgroundSoft }]}>
          <Ionicons name="call" size={20} color={theme.colors.success} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const ServiceSelectionStep = () => {
    const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
      const isSelected = bookingDetails.services.includes(service.id)
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

      const toggleService = () => {
        setBookingDetails((prev) => ({
          ...prev,
          services: isSelected ? prev.services.filter((id) => id !== service.id) : [...prev.services, service.id],
        }))
      }

      return (
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={[
              styles.serviceCard,
              {
                backgroundColor: theme.colors.backgroundLight,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
            onPress={toggleService}
            activeOpacity={0.95}
          >
            {service.popular && (
              <View style={[styles.popularBadge, { backgroundColor: theme.colors.warning }]}>
                <Text style={styles.popularText}>POPULAR</Text>
              </View>
            )}

            <View style={styles.serviceCardHeader}>
              <View style={[styles.serviceIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name={service.icon as any} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, { color: theme.colors.text }]}>{service.name}</Text>
                <Text style={[styles.serviceCategory, { color: theme.colors.textLight }]}>{service.category}</Text>
              </View>
              <View
                style={[
                  styles.selectionIndicator,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : "transparent",
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
            </View>

            <Text style={[styles.serviceDescription, { color: theme.colors.textLight }]}>{service.description}</Text>

            <View style={styles.serviceFooter}>
              <View style={styles.servicePricing}>
                <Text style={[styles.servicePrice, { color: theme.colors.text }]}>₹{service.basePrice}</Text>
                <Text style={[styles.serviceDuration, { color: theme.colors.textLighter }]}>
                  {service.duration}h duration
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )
    }

    return (
      <View style={styles.stepContent}>
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Select Services</Text>
        <Text style={[styles.stepSubtitle, { color: theme.colors.textLight }]}>
          Choose the services you need from {employee.name}
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.servicesContainer}>
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </ScrollView>

        {bookingDetails.services.length > 0 && (
          <View style={[styles.selectionSummary, { backgroundColor: theme.colors.primarySoft }]}>
            <Text style={[styles.summaryText, { color: theme.colors.primary }]}>
              {bookingDetails.services.length} service{bookingDetails.services.length > 1 ? "s" : ""} selected •{" "}
              {bookingDetails.duration}h total • ₹{bookingDetails.pricing.serviceTotal}
            </Text>
          </View>
        )}
      </View>
    )
  }

  const ScheduleSelectionStep = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())

    const DateSelector = () => {
      const dates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        dates.push(date)
      }

      return (
        <View style={styles.dateSelector}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
            {dates.map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString()
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.backgroundLight,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedDate(date)
                    setBookingDetails((prev) => ({ ...prev, date }))
                  }}
                >
                  <Text style={[styles.dateDay, { color: isSelected ? "#FFFFFF" : theme.colors.textLighter }]}>
                    {date.toLocaleDateString("en-IN", { weekday: "short" })}
                  </Text>
                  <Text style={[styles.dateNumber, { color: isSelected ? "#FFFFFF" : theme.colors.text }]}>
                    {date.getDate()}
                  </Text>
                  {isToday && (
                    <Text style={[styles.todayLabel, { color: isSelected ? "#FFFFFF" : theme.colors.primary }]}>
                      Today
                    </Text>
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      )
    }

    const TimeSelector = () => (
      <View style={styles.timeSelector}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Time</Text>
        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((slot) => {
            const isSelected = bookingDetails.timeSlot === slot.time
            const isAvailable = slot.available

            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : isAvailable
                        ? theme.colors.backgroundLight
                        : theme.colors.backgroundSoft,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    opacity: isAvailable ? 1 : 0.5,
                  },
                ]}
                onPress={() => {
                  if (isAvailable) {
                    setBookingDetails((prev) => ({ ...prev, timeSlot: slot.time }))
                  }
                }}
                disabled={!isAvailable}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    { color: isSelected ? "#FFFFFF" : isAvailable ? theme.colors.text : theme.colors.textLighter },
                  ]}
                >
                  {slot.time}
                </Text>
                {slot.price && isAvailable && (
                  <Text style={[styles.surgePrice, { color: isSelected ? "#FFFFFF" : theme.colors.warning }]}>
                    +₹{slot.price}
                  </Text>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )

    const UrgencySelector = () => (
      <View style={styles.urgencySelector}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service Priority</Text>
        <View style={styles.urgencyOptions}>
          {[
            { key: "normal", label: "Normal", description: "Standard service", fee: "No extra fee", icon: "time" },
            {
              key: "urgent",
              label: "Urgent",
              description: "Priority service",
              fee: "+20% fee",
              icon: "flash",
            },
            {
              key: "emergency",
              label: "Emergency",
              description: "Immediate service",
              fee: "+50% fee",
              icon: "warning",
            },
          ].map((option) => {
            const isSelected = bookingDetails.urgency === option.key

            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.urgencyOption,
                  {
                    backgroundColor: isSelected ? theme.colors.primarySoft : theme.colors.backgroundLight,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setBookingDetails((prev) => ({ ...prev, urgency: option.key as any }))}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={isSelected ? theme.colors.primary : theme.colors.textLight}
                />
                <View style={styles.urgencyInfo}>
                  <Text style={[styles.urgencyLabel, { color: isSelected ? theme.colors.primary : theme.colors.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.urgencyDescription, { color: theme.colors.textLight }]}>
                    {option.description}
                  </Text>
                </View>
                <Text
                  style={[styles.urgencyFee, { color: isSelected ? theme.colors.primary : theme.colors.textLighter }]}
                >
                  {option.fee}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )

    return (
      <View style={styles.stepContent}>
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Schedule Service</Text>
        <Text style={[styles.stepSubtitle, { color: theme.colors.textLight }]}>
          Choose your preferred date and time
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <DateSelector />
          <TimeSelector />
          <UrgencySelector />
        </ScrollView>
      </View>
    )
  }

  const LocationDetailsStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Location & Details</Text>
      <Text style={[styles.stepSubtitle, { color: theme.colors.textLight }]}>
        Provide service location and additional details
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.locationSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service Location</Text>
          <View style={styles.locationOptions}>
            <TouchableOpacity
              style={[
                styles.locationOption,
                {
                  backgroundColor:
                    bookingDetails.location.type === "current"
                      ? theme.colors.primarySoft
                      : theme.colors.backgroundLight,
                  borderColor: bookingDetails.location.type === "current" ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() =>
                setBookingDetails((prev) => ({
                  ...prev,
                  location: { ...prev.location, type: "current" },
                }))
              }
            >
              <Ionicons
                name="location"
                size={20}
                color={bookingDetails.location.type === "current" ? theme.colors.primary : theme.colors.textLight}
              />
              <View style={styles.locationOptionInfo}>
                <Text
                  style={[
                    styles.locationOptionTitle,
                    {
                      color: bookingDetails.location.type === "current" ? theme.colors.primary : theme.colors.text,
                    },
                  ]}
                >
                  Current Location
                </Text>
                <Text style={[styles.locationOptionAddress, { color: theme.colors.textLight }]}>
                  Connaught Place, New Delhi
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.locationOption,
                {
                  backgroundColor:
                    bookingDetails.location.type === "custom" ? theme.colors.primarySoft : theme.colors.backgroundLight,
                  borderColor: bookingDetails.location.type === "custom" ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() =>
                setBookingDetails((prev) => ({
                  ...prev,
                  location: { ...prev.location, type: "custom" },
                }))
              }
            >
              <Ionicons
                name="home"
                size={20}
                color={bookingDetails.location.type === "custom" ? theme.colors.primary : theme.colors.textLight}
              />
              <View style={styles.locationOptionInfo}>
                <Text
                  style={[
                    styles.locationOptionTitle,
                    {
                      color: bookingDetails.location.type === "custom" ? theme.colors.primary : theme.colors.text,
                    },
                  ]}
                >
                  Custom Address
                </Text>
                <Text style={[styles.locationOptionAddress, { color: theme.colors.textLight }]}>
                  Enter a different address
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {bookingDetails.location.type === "custom" && (
            <View style={styles.customAddressInput}>
              <TextInput
                style={[
                  styles.addressInput,
                  { backgroundColor: theme.colors.backgroundLight, color: theme.colors.text },
                ]}
                placeholder="Enter complete address..."
                placeholderTextColor={theme.colors.textLighter}
                value={bookingDetails.location.address}
                onChangeText={(text) =>
                  setBookingDetails((prev) => ({
                    ...prev,
                    location: { ...prev.location, address: text },
                  }))
                }
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </View>

        <View style={styles.instructionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Special Instructions</Text>
          <TextInput
            style={[
              styles.instructionsInput,
              { backgroundColor: theme.colors.backgroundLight, color: theme.colors.text },
            ]}
            placeholder="Any specific requirements or instructions for the professional..."
            placeholderTextColor={theme.colors.textLighter}
            value={bookingDetails.notes}
            onChangeText={(text) => setBookingDetails((prev) => ({ ...prev, notes: text }))}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.recurringSection}>
          <View style={styles.recurringHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recurring Service</Text>
            <TouchableOpacity
              style={[
                styles.recurringToggle,
                {
                  backgroundColor: bookingDetails.recurring?.enabled
                    ? theme.colors.primary
                    : theme.colors.backgroundSoft,
                },
              ]}
              onPress={() =>
                setBookingDetails((prev) => ({
                  ...prev,
                  recurring: {
                    ...prev.recurring,
                    enabled: !prev.recurring?.enabled,
                    frequency: "weekly",
                  },
                }))
              }
            >
              <View
                style={[
                  styles.toggleSlider,
                  {
                    backgroundColor: "#FFFFFF",
                    transform: [{ translateX: bookingDetails.recurring?.enabled ? 20 : 2 }],
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {bookingDetails.recurring?.enabled && (
            <View style={styles.recurringOptions}>
              {["weekly", "biweekly", "monthly"].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyOption,
                    {
                      backgroundColor:
                        bookingDetails.recurring?.frequency === freq
                          ? theme.colors.primarySoft
                          : theme.colors.backgroundLight,
                      borderColor:
                        bookingDetails.recurring?.frequency === freq ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() =>
                    setBookingDetails((prev) => ({
                      ...prev,
                      recurring: { ...prev.recurring!, frequency: freq as any },
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      {
                        color: bookingDetails.recurring?.frequency === freq ? theme.colors.primary : theme.colors.text,
                      },
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )

  const ReviewPaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Review & Payment</Text>
      <Text style={[styles.stepSubtitle, { color: theme.colors.textLight }]}>
        Review your booking details and choose payment method
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Booking Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.backgroundLight }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.summaryLabel, { color: theme.colors.textLight }]}>Date & Time</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {formatDate(bookingDetails.date)} at {bookingDetails.timeSlot}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.summaryLabel, { color: theme.colors.textLight }]}>Duration</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{bookingDetails.duration} hours</Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.summaryLabel, { color: theme.colors.textLight }]}>Location</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]} numberOfLines={2}>
              {bookingDetails.location.address}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="flash-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.summaryLabel, { color: theme.colors.textLight }]}>Priority</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {bookingDetails.urgency.charAt(0).toUpperCase() + bookingDetails.urgency.slice(1)}
            </Text>
          </View>
        </View>

        {/* Services Summary */}
        <View style={[styles.servicesCard, { backgroundColor: theme.colors.backgroundLight }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Selected Services</Text>
          {services
            .filter((service) => bookingDetails.services.includes(service.id))
            .map((service) => (
              <View key={service.id} style={styles.serviceRow}>
                <View style={styles.serviceRowInfo}>
                  <Text style={[styles.serviceRowName, { color: theme.colors.text }]}>{service.name}</Text>
                  <Text style={[styles.serviceRowDuration, { color: theme.colors.textLight }]}>
                    {service.duration}h
                  </Text>
                </View>
                <Text style={[styles.serviceRowPrice, { color: theme.colors.text }]}>₹{service.basePrice}</Text>
              </View>
            ))}
        </View>

        {/* Pricing Breakdown */}
        <View style={[styles.pricingCard, { backgroundColor: theme.colors.backgroundLight }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Price Breakdown</Text>

          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Services Total</Text>
            <Text style={[styles.pricingValue, { color: theme.colors.text }]}>
              ₹{bookingDetails.pricing.serviceTotal}
            </Text>
          </View>

          {bookingDetails.pricing.urgencyFee > 0 && (
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>
                {bookingDetails.urgency.charAt(0).toUpperCase() + bookingDetails.urgency.slice(1)} Fee
              </Text>
              <Text style={[styles.pricingValue, { color: theme.colors.warning }]}>
                +₹{bookingDetails.pricing.urgencyFee}
              </Text>
            </View>
          )}

          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Platform Fee</Text>
            <Text style={[styles.pricingValue, { color: theme.colors.text }]}>
              ₹{bookingDetails.pricing.platformFee}
            </Text>
          </View>

          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.textLight }]}>Taxes (18%)</Text>
            <Text style={[styles.pricingValue, { color: theme.colors.text }]}>₹{bookingDetails.pricing.taxes}</Text>
          </View>

          <View style={[styles.pricingDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.pricingRow}>
            <Text style={[styles.pricingTotalLabel, { color: theme.colors.text }]}>Total Amount</Text>
            <Text style={[styles.pricingTotalValue, { color: theme.colors.text }]}>
              ₹{bookingDetails.pricing.total}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={[styles.paymentCard, { backgroundColor: theme.colors.backgroundLight }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Payment Method</Text>

          {[
            { key: "upi", label: "UPI Payment", icon: "card", description: "Pay via UPI apps" },
            { key: "card", label: "Credit/Debit Card", icon: "card-outline", description: "Secure card payment" },
            { key: "wallet", label: "Digital Wallet", icon: "wallet", description: "Paytm, PhonePe, etc." },
            { key: "cash", label: "Cash on Service", icon: "cash", description: "Pay after service completion" },
          ].map((method) => {
            const isSelected = bookingDetails.paymentMethod === method.key

            return (
              <TouchableOpacity
                key={method.key}
                style={[
                  styles.paymentMethod,
                  {
                    backgroundColor: isSelected ? theme.colors.primarySoft : "transparent",
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setBookingDetails((prev) => ({ ...prev, paymentMethod: method.key as any }))}
              >
                <Ionicons
                  name={method.icon as any}
                  size={20}
                  color={isSelected ? theme.colors.primary : theme.colors.textLight}
                />
                <View style={styles.paymentMethodInfo}>
                  <Text
                    style={[
                      styles.paymentMethodLabel,
                      { color: isSelected ? theme.colors.primary : theme.colors.text },
                    ]}
                  >
                    {method.label}
                  </Text>
                  <Text style={[styles.paymentMethodDescription, { color: theme.colors.textLight }]}>
                    {method.description}
                  </Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )

  const ConfirmationModal = () => (
    <Modal visible={showConfirmation} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.confirmationModal, { backgroundColor: theme.colors.background }]}>
          <View style={styles.confirmationContent}>
            <View style={[styles.successIcon, { backgroundColor: theme.colors.success }]}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>

            <Text style={[styles.confirmationTitle, { color: theme.colors.text }]}>Booking Confirmed!</Text>

            <Text style={[styles.confirmationMessage, { color: theme.colors.textLight }]}>
              Your service has been booked successfully. {employee.name} will contact you shortly.
            </Text>

            <View style={[styles.bookingIdCard, { backgroundColor: theme.colors.backgroundLight }]}>
              <Text style={[styles.bookingIdLabel, { color: theme.colors.textLight }]}>Booking ID</Text>
              <Text style={[styles.bookingIdValue, { color: theme.colors.text }]}>
                #BK{Date.now().toString().slice(-6)}
              </Text>
            </View>

            <View style={styles.confirmationActions}>
              <TouchableOpacity
                style={[styles.trackButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setShowConfirmation(false)
                  // Navigate to booking tracking
                }}
              >
                <Text style={styles.trackButtonText}>Track Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.homeButton, { backgroundColor: theme.colors.backgroundSoft }]}
                onPress={() => {
                  setShowConfirmation(false)
                  navigation.goBack()
                }}
              >
                <Text style={[styles.homeButtonText, { color: theme.colors.textLight }]}>Go Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelectionStep />
      case 2:
        return <ScheduleSelectionStep />
      case 3:
        return <LocationDetailsStep />
      case 4:
        return <ReviewPaymentStep />
      default:
        return <ServiceSelectionStep />
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Book Service</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textLight }]}>Step {currentStep} of 4</Text>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <StepIndicator />
      <EmployeeHeader />

      {/* Step Content */}
      <View style={styles.contentContainer}>{renderStepContent()}</View>

      {/* Bottom Navigation */}
      <View
        style={[
          styles.bottomNavigation,
          { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border },
        ]}
      >
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.backNavButton, { backgroundColor: theme.colors.backgroundSoft }]}
            onPress={prevStep}
          >
            <Text style={[styles.backNavText, { color: theme.colors.textLight }]}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextNavButton,
            {
              backgroundColor: canProceed() ? theme.colors.primary : theme.colors.backgroundSoft,
              flex: currentStep === 1 ? 1 : 2,
            },
          ]}
          onPress={nextStep}
          disabled={!canProceed()}
        >
          <Text style={[styles.nextNavText, { color: canProceed() ? "#FFFFFF" : theme.colors.textLighter }]}>
            {currentStep === 4 ? `Confirm Booking • ₹${bookingDetails.pricing.total}` : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal />
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
  helpButton: {
    padding: 8,
  },
  stepIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepLabel: {
    alignItems: "center",
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "600",
  },
  stepLabelText: {
    fontSize: 12,
    fontWeight: "500",
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  employeeAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    marginRight: 16,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },
  employeeProfession: {
    fontSize: 14,
    marginBottom: 6,
  },
  employeeMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 2,
  },
  responseTime: {
    fontSize: 12,
  },
  employeeActions: {
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
  contentContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  // Service Selection Styles
  servicesContainer: {
    flex: 1,
  },
  serviceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  serviceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  serviceCategory: {
    fontSize: 14,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicePricing: {
    flex: 1,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 12,
  },
  selectionSummary: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  // Schedule Selection Styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  dateSelector: {
    marginBottom: 32,
  },
  datesContainer: {
    paddingVertical: 8,
  },
  dateCard: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    minWidth: 70,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  timeSelector: {
    marginBottom: 32,
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: (width - 64) / 3,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  surgePrice: {
    fontSize: 10,
    fontWeight: "500",
  },
  urgencySelector: {
    marginBottom: 32,
  },
  urgencyOptions: {
    gap: 12,
  },
  urgencyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  urgencyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  urgencyDescription: {
    fontSize: 14,
  },
  urgencyFee: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Location Details Styles
  locationSection: {
    marginBottom: 32,
  },
  locationOptions: {
    gap: 12,
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationOptionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  locationOptionAddress: {
    fontSize: 14,
  },
  customAddressInput: {
    marginTop: 16,
  },
  addressInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 80,
  },
  instructionsSection: {
    marginBottom: 32,
  },
  instructionsInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
  },
  recurringSection: {
    marginBottom: 32,
  },
  recurringHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recurringToggle: {
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
    position: "absolute",
  },
  recurringOptions: {
    flexDirection: "row",
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Review Payment Styles
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  servicesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  serviceRowInfo: {
    flex: 1,
  },
  serviceRowName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  serviceRowDuration: {
    fontSize: 12,
  },
  serviceRowPrice: {
    fontSize: 14,
    fontWeight: "600",
  },
  pricingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
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
  paymentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
  },
  // Bottom Navigation
  bottomNavigation: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  navButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backNavButton: {
    flex: 1,
  },
  nextNavButton: {
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  backNavText: {
    fontSize: 16,
    fontWeight: "600",
  },
  nextNavText: {
    fontSize: 16,
    fontWeight: "700",
  },
  // Confirmation Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationModal: {
    borderRadius: 24,
    padding: 32,
    margin: 20,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmationContent: {
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  confirmationMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  bookingIdCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: "center",
    minWidth: 200,
  },
  bookingIdLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookingIdValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  confirmationActions: {
    width: "100%",
    gap: 12,
  },
  trackButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  homeButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

export default EmployeeBookingScreen
