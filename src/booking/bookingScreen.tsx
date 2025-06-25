"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle, runOnJS } from "react-native-reanimated"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"

const { width, height } = Dimensions.get("window")

// Ultra clean color palette
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

interface Bid {
  id: string
  workerId: string
  workerName: string
  proposedPrice: number
  message: string
  estimatedTime: string
  timestamp: Date
  status: "pending" | "accepted" | "rejected" | "countered"
  counterOffer?: number
}

interface Worker {
  id: string
  name: string
  category: string
  rating: number
  distance: number
  price: number
  image: any
  available: boolean
  location: { latitude: number; longitude: number }
  estimatedArrival: string
  completedJobs: number
  verified: boolean
  phoneNumber: string
  acceptsBidding: boolean
}

const BookingMapScreen: React.FC = () => {
  const navigation = useNavigation()
  const mapRef = useRef<MapView>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const pulseAnim = useSharedValue(1)

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [bookingPhase, setBookingPhase] = useState<"browse" | "negotiate" | "confirm" | "tracking">("browse")
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [proposedPrice, setProposedPrice] = useState("")
  const [negotiationMessage, setNegotiationMessage] = useState("")
  const [priceNegotiation, setPriceNegotiation] = useState<{
    originalPrice: number
    proposedPrice: number
    status: "pending" | "accepted" | "countered"
    counterPrice?: number
  } | null>(null)

  const userLocation = {
    latitude: 28.6139,
    longitude: 77.209,
    address: "Connaught Place, New Delhi",
  }

  const nearbyWorkers: Worker[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      category: "Electrician",
      rating: 4.8,
      distance: 0.5,
      price: 500,
      image: workerImage,
      available: true,
      location: { latitude: 28.6149, longitude: 77.209 },
      estimatedArrival: "5 min",
      completedJobs: 150,
      verified: true,
      phoneNumber: "+91 98765 43210",
      acceptsBidding: true,
    },
    {
      id: "2",
      name: "Amit Singh",
      category: "Electrician",
      rating: 4.6,
      distance: 1.2,
      price: 450,
      image: workerImage,
      available: true,
      location: { latitude: 28.6129, longitude: 77.21 },
      estimatedArrival: "12 min",
      completedJobs: 89,
      verified: true,
      phoneNumber: "+91 98765 43211",
      acceptsBidding: true,
    },
    {
      id: "3",
      name: "Suresh Yadav",
      category: "Electrician",
      rating: 4.9,
      distance: 0.8,
      price: 550,
      image: workerImage,
      available: false,
      location: { latitude: 28.6159, longitude: 77.208 },
      estimatedArrival: "Busy",
      completedJobs: 200,
      verified: true,
      phoneNumber: "+91 98765 43212",
      acceptsBidding: false,
    },
  ]

  // Simulate receiving bids
  useEffect(() => {
    if (false) {
      const timer = setTimeout(() => {
        const mockBids: Bid[] = [
          {
            id: "bid1",
            workerId: "1",
            workerName: "Rajesh Kumar",
            proposedPrice: 420,
            message: "I can complete the work efficiently with 5 years experience",
            estimatedTime: "2 hours",
            timestamp: new Date(),
            status: "pending",
          },
          {
            id: "bid2",
            workerId: "2",
            workerName: "Amit Singh",
            proposedPrice: 380,
            message: "Quick service guaranteed, available immediately",
            estimatedTime: "1.5 hours",
            timestamp: new Date(),
            status: "pending",
          },
        ]
        // setBids(mockBids)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Pulse animation for user location
  useEffect(() => {
    const pulse = () => {
      pulseAnim.value = withSequence(
        withTiming(1.3, { duration: 1500 }),
        withTiming(1, { duration: 1500, onEnd: () => runOnJS(pulse)() }),
      )
    }
    pulse()
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }))

  const handleSheetChanges = useCallback((index: number) => {
    console.log("BottomSheet index changed to:", index)
  }, [])

  const handleWorkerSelect = useCallback((worker: Worker) => {
    if (!worker.available) {
      Alert.alert("Worker Unavailable", "This worker is currently busy with another job.")
      return
    }

    setSelectedWorker(worker)
    setBookingPhase("confirm")

    mapRef.current?.animateToRegion(
      {
        latitude: worker.location.latitude,
        longitude: worker.location.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      800,
    )

    bottomSheetRef.current?.snapToIndex(1)
  }, [])

  const handleNegotiatePrice = (worker: Worker) => {
    setSelectedWorker(worker)
    setProposedPrice(worker.price.toString())
    setShowPriceModal(true)
  }

  const handleSubmitPriceNegotiation = () => {
    if (!proposedPrice || !selectedWorker) return

    const proposed = Number.parseInt(proposedPrice)
    setPriceNegotiation({
      originalPrice: selectedWorker.price,
      proposedPrice: proposed,
      status: "pending",
    })

    setBookingPhase("negotiate")
    setShowPriceModal(false)
    bottomSheetRef.current?.snapToIndex(1)

    // Simulate worker response after 2 seconds
    setTimeout(() => {
      if (proposed >= selectedWorker.price * 0.8) {
        setPriceNegotiation((prev) => (prev ? { ...prev, status: "accepted" } : null))
        Alert.alert("Price Accepted! ✅", `${selectedWorker.name} has accepted your offer of ₹${proposed}`)
      } else {
        const counterPrice = Math.floor(selectedWorker.price * 0.9)
        setPriceNegotiation((prev) => (prev ? { ...prev, status: "countered", counterPrice } : null))
        Alert.alert("Counter Offer", `${selectedWorker.name} counter-offered ₹${counterPrice}`)
      }
    }, 2000)
  }

  const handleBookingConfirm = useCallback(() => {
    setBookingPhase("tracking")
    Alert.alert("Booking Confirmed! 🎉", `${selectedWorker?.name} is on the way.`)
  }, [selectedWorker])

  const handleBackPress = useCallback(() => {
    if (bookingPhase !== "browse") {
      setBookingPhase("browse")
      setSelectedWorker(null)
      // setBiddingActive(false)
      // setBids([])
      setPriceNegotiation(null)
      bottomSheetRef.current?.snapToIndex(1)
    } else {
      navigation.goBack()
    }
  }, [bookingPhase, navigation])

  const renderUserMarker = () => (
    <Marker coordinate={userLocation} tracksViewChanges={false}>
      <Animated.View style={[styles.userMarker, animatedStyle]}>
        <View style={styles.userDot} />
      </Animated.View>
    </Marker>
  )

  const renderWorkerMarker = (worker: Worker) => (
    <Marker
      key={worker.id}
      coordinate={worker.location}
      onPress={() => handleWorkerSelect(worker)}
      tracksViewChanges={false}
    >
      <View style={[styles.workerMarker, selectedWorker?.id === worker.id && styles.selectedWorker]}>
        <View style={[styles.statusIndicator, { backgroundColor: worker.available ? theme.success : theme.error }]} />
        {worker.available && (
          <View style={styles.priceTag}>
            <Text style={styles.workerPriceText}>₹{worker.price}</Text>
          </View>
        )}
      </View>
    </Marker>
  )

  const WorkerCard = ({
    worker,
    onSelect,
    onNegotiate,
  }: {
    worker: Worker
    onSelect: () => void
    onNegotiate: () => void
  }) => (
    <TouchableOpacity
      style={[styles.workerCard, !worker.available && styles.unavailableCard]}
      disabled={!worker.available}
      activeOpacity={0.7}
    >
      <View style={styles.cardLeft}>
        <Image source={worker.image} style={styles.cardAvatar} />
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.workerName}>{worker.name}</Text>
            {worker.verified && <Ionicons name="checkmark-circle" size={16} color={theme.accent} />}
          </View>
          <Text style={styles.workerCategory}>{worker.category}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={12} color={theme.warning} />
              <Text style={styles.metaText}>{worker.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={12} color={theme.textSecondary} />
              <Text style={styles.metaText}>{worker.distance} km</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={12} color={theme.textSecondary} />
              <Text style={styles.metaText}>{worker.estimatedArrival}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.workerPrice}>₹{worker.price}</Text>
        <Text style={styles.priceUnit}>per hour</Text>
        {worker.available && (
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.bookButton} onPress={()=>navigation.navigate("EmployeeBookingScreen")}>
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </View>
        )}
        {!worker.available && <Text style={styles.busyText}>Busy</Text>}
      </View>
    </TouchableOpacity>
  )

  const renderBottomSheetContent = () => {
    if (bookingPhase === "browse") {
      return (
        <BottomSheetScrollView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Available Workers</Text>
            <Text style={styles.sheetSubtitle}>{nearbyWorkers.filter((w) => w.available).length} workers nearby</Text>
          </View>

          {nearbyWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onSelect={() => handleWorkerSelect(worker)}
              onNegotiate={() => handleNegotiatePrice(worker)}
            />
          ))}
        </BottomSheetScrollView>
      )
    }

    if (bookingPhase === "negotiate" && selectedWorker && priceNegotiation) {
      return (
        <View style={styles.sheetContent}>
          <View style={styles.negotiationHeader}>
            <Text style={styles.negotiationTitle}>Price Negotiation</Text>
            <Text style={styles.negotiationWorker}>{selectedWorker.name}</Text>
          </View>

          <View style={styles.priceComparison}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Original Price</Text>
              <Text style={styles.originalPrice}>₹{priceNegotiation.originalPrice}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={theme.textSecondary} />
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Your Offer</Text>
              <Text style={styles.proposedPrice}>₹{priceNegotiation.proposedPrice}</Text>
            </View>
          </View>

          {priceNegotiation.status === "pending" && (
            <View style={styles.pendingContainer}>
              <Ionicons name="hourglass-outline" size={32} color={theme.textSecondary} />
              <Text style={styles.pendingText}>Waiting for response...</Text>
            </View>
          )}

          {priceNegotiation.status === "accepted" && (
            <View style={styles.acceptedContainer}>
              <Ionicons name="checkmark-circle" size={32} color={theme.success} />
              <Text style={styles.acceptedText}>Price Accepted!</Text>
              <TouchableOpacity style={styles.proceedButton} onPress={() => setBookingPhase("confirm")}>
                <Text style={styles.proceedButtonText}>Proceed to Book</Text>
              </TouchableOpacity>
            </View>
          )}

          {priceNegotiation.status === "countered" && priceNegotiation.counterPrice && (
            <View style={styles.counterContainer}>
              <Text style={styles.counterTitle}>Counter Offer</Text>
              <Text style={styles.counterPrice}>₹{priceNegotiation.counterPrice}</Text>
              <View style={styles.counterActions}>
                <TouchableOpacity
                  style={styles.acceptCounterButton}
                  onPress={() => {
                    setPriceNegotiation((prev) =>
                      prev ? { ...prev, status: "accepted", proposedPrice: prev.counterPrice! } : null,
                    )
                  }}
                >
                  <Text style={styles.acceptCounterText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => {
                    setBookingPhase("browse")
                    setPriceNegotiation(null)
                    setSelectedWorker(null)
                  }}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )
    }

    if (bookingPhase === "confirm" && selectedWorker) {
      return (
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Confirm Booking</Text>
          <Text style={styles.sheetSubtitle}>
            {selectedWorker.name} - {selectedWorker.category}
          </Text>
          <Text style={styles.sheetSubtitle}>Location: {userLocation.address}</Text>
          <Text style={styles.sheetSubtitle}>Price: ₹{selectedWorker.price}/hour</Text>
          <View style={styles.confirmationActions}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleBookingConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setBookingPhase("browse")
                setSelectedWorker(null)
                bottomSheetRef.current?.snapToIndex(1)
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    if (bookingPhase === "tracking" && selectedWorker) {
      const finalPrice = priceNegotiation?.proposedPrice || selectedWorker.price

      return (
        <View style={styles.sheetContent}>
          <View style={styles.trackingHeader}>
            <Text style={styles.trackingTitle}>Worker On The Way</Text>
            <Text style={styles.trackingEta}>ETA: {selectedWorker.estimatedArrival}</Text>
            {priceNegotiation && <Text style={styles.agreedPrice}>Agreed Price: ₹{finalPrice}/hour</Text>}
          </View>
          <View style={styles.trackingWorker}>
            <Image source={selectedWorker?.image} style={styles.trackingAvatar} />
            <View style={styles.trackingInfo}>
              <Text style={styles.trackingName}>{selectedWorker?.name}</Text>
              <Text style={styles.trackingCategory}>{selectedWorker?.category}</Text>
              <View style={styles.trackingRating}>
                <Ionicons name="star" size={14} color={theme.warning} />
                <Text style={styles.ratingText}>{selectedWorker?.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={20} color={theme.background} />
            </TouchableOpacity>
          </View>
          <View style={styles.trackingActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.accent} />
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="location-outline" size={20} color={theme.accent} />
              <Text style={styles.actionText}>Share Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelActionButton]}>
              <Ionicons name="close-outline" size={20} color={theme.error} />
              <Text style={[styles.actionText, { color: theme.error }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.sheetContent}>
        <Text style={styles.sheetTitle}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Find Worker</Text>
          <Text style={styles.headerSubtitle}>{userLocation.address}</Text>
        </View>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location" size={20} color={theme.accent} />
        </TouchableOpacity>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ]}
      >
        {renderUserMarker()}
        <Circle
          center={userLocation}
          radius={1500}
          strokeColor={theme.accent}
          fillColor={`${theme.accent}15`}
          strokeWidth={1}
        />
        {nearbyWorkers.map(renderWorkerMarker)}
      </MapView>

      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            mapRef.current?.animateToRegion(
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              },
              800,
            )
          }}
        >
          <Ionicons name="locate" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={["10%", "60%", "90%"]}
        handleIndicatorStyle={styles.bottomSheetHandle}
        backgroundStyle={styles.bottomSheet}
        onChange={handleSheetChanges}
      >
        {renderBottomSheetContent()}
      </BottomSheet>

      {/* Bidding Modal */}
      <Modal visible={showPriceModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPriceModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Adjust Price</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.priceForm}>
              <Text style={styles.workerInfo}>
                {selectedWorker?.name} - {selectedWorker?.category}
              </Text>
              <Text style={styles.originalPriceText}>Original Price: ₹{selectedWorker?.price}/hour</Text>

              <Text style={styles.formLabel}>Your Offer</Text>
              <TextInput
                style={styles.priceInput}
                value={proposedPrice}
                onChangeText={setProposedPrice}
                placeholder="Enter your price (₹)"
                keyboardType="numeric"
              />

              <Text style={styles.formLabel}>Message (Optional)</Text>
              <TextInput
                style={styles.messageInput}
                value={negotiationMessage}
                onChangeText={setNegotiationMessage}
                placeholder="Add a message to your offer..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <View style={styles.priceInfo}>
                <Ionicons name="information-circle" size={20} color={theme.accent} />
                <Text style={styles.priceInfoText}>
                  The worker can accept your offer or make a counter-offer. Be reasonable with your pricing.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.submitPriceButton} onPress={handleSubmitPriceNegotiation}>
              <Text style={styles.submitPriceText}>Send Offer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingVertical: 12,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  locationButton: {
    padding: 8,
    backgroundColor: theme.surface,
    borderRadius: 8,
  },
  map: {
    flex: 1,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.background,
  },
  workerMarker: {
    alignItems: "center",
    position: "relative",
  },
  selectedWorker: {
    transform: [{ scale: 1.1 }],
  },
  statusIndicator: {
    position: "absolute",
    bottom: 20,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.background,
  },
  priceTag: {
    backgroundColor: theme.text,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  workerPriceText: {
    color: theme.background,
    fontSize: 10,
    fontWeight: "600",
  },
  mapControls: {
    position: "absolute",
    right: 20,
    bottom: 120,
  },
  controlButton: {
    backgroundColor: theme.background,
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomSheet: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.textTertiary,
    borderRadius: 2,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sheetHeader: {
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.text,
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 4,
  },
  workerCard: {
    flexDirection: "row",
    backgroundColor: theme.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unavailableCard: {
    opacity: 0.6,
  },
  cardLeft: {
    flex: 1,
    flexDirection: "row",
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    marginRight: 6,
  },
  workerCategory: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginLeft: 3,
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  workerPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.text,
  },
  priceUnit: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  busyText: {
    fontSize: 12,
    color: theme.error,
    fontWeight: "600",
    marginTop: 4,
  },
  cardActions: {
    marginTop: 8,
    gap: 6,
  },
  bookButton: {
    backgroundColor: theme.accent,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: theme.background,
    fontSize: 12,
    fontWeight: "600",
  },
  negotiateButton: {
    backgroundColor: theme.surface,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  negotiateButtonText: {
    color: theme.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  negotiationHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  negotiationTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.text,
    marginBottom: 8,
  },
  negotiationWorker: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  priceComparison: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  priceItem: {
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.textSecondary,
    textDecorationLine: "line-through",
  },
  proposedPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.accent,
  },
  pendingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  pendingText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 12,
  },
  acceptedContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  acceptedText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.success,
    marginTop: 12,
    marginBottom: 20,
  },
  proceedButton: {
    backgroundColor: theme.success,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  proceedButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: "600",
  },
  counterContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  counterPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.accent,
    marginBottom: 20,
  },
  counterActions: {
    flexDirection: "row",
    gap: 12,
  },
  acceptCounterButton: {
    backgroundColor: theme.success,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  acceptCounterText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: "600",
  },
  declineButton: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: theme.border,
  },
  declineText: {
    color: theme.error,
    fontSize: 16,
    fontWeight: "600",
  },
  priceForm: {
    paddingVertical: 24,
  },
  workerInfo: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  originalPriceText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 24,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 80,
    marginBottom: 24,
  },
  priceInfo: {
    flexDirection: "row",
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start",
  },
  priceInfoText: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  submitPriceButton: {
    backgroundColor: theme.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitPriceText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: "700",
  },
  // Tracking styles
  trackingHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  trackingTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 4,
  },
  trackingEta: {
    fontSize: 16,
    color: theme.success,
    fontWeight: "600",
  },
  agreedPrice: {
    fontSize: 14,
    color: theme.accent,
    fontWeight: "600",
    marginTop: 4,
  },
  trackingWorker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  trackingAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  trackingInfo: {
    flex: 1,
  },
  trackingName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 4,
  },
  trackingCategory: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  trackingRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
    marginLeft: 4,
  },
  callButton: {
    backgroundColor: theme.success,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  trackingActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: theme.surface,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.accent,
    marginTop: 4,
  },
  cancelActionButton: {
    backgroundColor: "#FEF2F2",
  },
  confirmButton: {
    backgroundColor: theme.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  confirmButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.error,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmationActions: {
    marginTop: 20,
  },
})

export default BookingMapScreen
