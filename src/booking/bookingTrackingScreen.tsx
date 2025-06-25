import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Alert,
  Linking,
} from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation, useRoute } from "@react-navigation/native"
// import { useWorkerTracking } from "../hooks/useBooking"
import { generateRouteCoordinates } from "../utils/mapUtils"
import man from "../images/man.jpg"

const { width, height } = Dimensions.get("window")

const colors = {
  primary: "#10B981",
  primaryLight: "#34D399",
  primarySoft: "#D1FAE5",
  text: "#1F2937",
  textLight: "#6B7280",
  textLighter: "#9CA3AF",
  background: "#FFFFFF",
  backgroundLight: "#F9FAFB",
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  blue: "#3B82F6",
}

const BookingTrackingScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const mapRef = useRef<MapView>(null)
  const pulseAnim = useRef(new Animated.Value(1)).current

  const { booking } = route.params as { booking: any }
  const { workerLocation, estimatedArrival, isTracking } = useWorkerTracking(booking.workerId)

  const [userLocation] = useState({
    latitude: 28.6139,
    longitude: 77.209,
  })

  const [worker] = useState({
    id: booking.workerId,
    name: "Rajesh Kumar",
    category: "Electrician",
    rating: 4.8,
    image: man,
    phone: "+91 98765 43210",
  })

  // Pulse animation for user location
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse())
    }
    pulse()
  }, [])

  // Auto-focus map when worker location updates
  useEffect(() => {
    if (workerLocation && mapRef.current) {
      const locations = [userLocation, workerLocation]
      mapRef.current.fitToCoordinates(locations, {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      })
    }
  }, [workerLocation, userLocation])

  const handleCall = () => {
    Linking.openURL(`tel:${worker.phone}`)
  }

  const handleMessage = () => {
    Alert.alert("Message", "Opening chat with worker...")
  }

  const handleCancelBooking = () => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          navigation.goBack()
        },
      },
    ])
  }

  const routeCoordinates = workerLocation ? generateRouteCoordinates(workerLocation, userLocation) : []

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Tracking Worker</Text>
          <Text style={styles.headerSubtitle}>Booking #{booking.id.slice(-6)}</Text>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {/* User Location */}
        <Marker coordinate={userLocation} tracksViewChanges={false}>
          <Animated.View style={[styles.userMarker, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.userMarkerInner} />
          </Animated.View>
        </Marker>

        {/* Worker Location */}
        {workerLocation && (
          <Marker coordinate={workerLocation} tracksViewChanges={false}>
            <View style={styles.workerMarker}>
              <Image source={worker.image} style={styles.workerMarkerImage} />
              <View style={styles.workerMarkerStatus} />
            </View>
          </Marker>
        )}

        {/* Route */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.primary}
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIcon}>
            <Ionicons name="car-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>{worker.name} is on the way</Text>
            <Text style={styles.statusSubtitle}>{estimatedArrival || "Calculating arrival time..."}</Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={styles.pulsingDot} />
          </View>
        </View>

        {/* Worker Details */}
        <View style={styles.workerDetails}>
          <Image source={worker.image} style={styles.workerImage} />
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerCategory}>{worker.category}</Text>
            <View style={styles.workerRating}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={styles.ratingText}>{worker.rating}</Text>
            </View>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.serviceDetails}>
          <View style={styles.serviceItem}>
            <Ionicons name="construct-outline" size={16} color={colors.textLight} />
            <Text style={styles.serviceText}>{booking.serviceType}</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="time-outline" size={16} color={colors.textLight} />
            <Text style={styles.serviceText}>{booking.scheduledTime}</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="cash-outline" size={16} color={colors.textLight} />
            <Text style={styles.serviceText}>₹{booking.totalAmount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color={colors.background} />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleMessage}>
            <Ionicons name="chatbubble" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, styles.messageButtonText]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelBooking}>
            <Ionicons name="close" size={20} color={colors.error} />
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={() => {
            if (workerLocation) {
              const locations = [userLocation, workerLocation]
              mapRef.current?.fitToCoordinates(locations, {
                edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
                animated: true,
              })
            }
          }}
        >
          <Ionicons name="locate" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 1000,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  helpButton: {
    padding: 4,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: "absolute",
    right: 20,
    bottom: 320,
  },
  mapControlButton: {
    backgroundColor: colors.background,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
  },
  userMarkerInner: {
    flex: 1,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  workerMarker: {
    position: "relative",
  },
  workerMarkerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.background,
  },
  workerMarkerStatus: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  statusCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  statusIndicator: {
    alignItems: "center",
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  workerDetails: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  workerCategory: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  workerRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginLeft: 4,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  serviceText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.background,
  },
  messageButton: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  messageButtonText: {
    color: colors.primary,
  },
  cancelButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: colors.error,
  },
  cancelButtonText: {
    color: colors.error,
  },
})

export default BookingTrackingScreen
