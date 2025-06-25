import type React from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../contexts/themeContext";

interface Worker {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: number;
  price: number;
  image: any;
  available: boolean;
  location: { latitude: number; longitude: number };
  estimatedArrival: string;
  completedJobs: number;
  skills: string[];
  verified: boolean;
}

interface BookingDetails {
  serviceType: string;
  scheduledTime: string;
  estimatedDuration: string;
  totalAmount: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

interface BookingConfirmationProps {
  worker: Worker;
  bookingDetails: BookingDetails;
  userLocation: UserLocation;
  onConfirm: () => void;
  onCancel: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  worker,
  bookingDetails,
  userLocation,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const serviceFee = Math.round(bookingDetails.totalAmount * 0.1);
  const totalAmount = bookingDetails.totalAmount + serviceFee;

  // Animation states for staggered reveal
  const fadeAnim = new Animated.Value(0);
  const workerAnim = new Animated.Value(0);
  const serviceAnim = new Animated.Value(0);
  const pricingAnim = new Animated.Value(0);
  const paymentAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(workerAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(serviceAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pricingAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(paymentAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.header, animatedStyle(fadeAnim)]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Confirm Booking</Text>
        <View style={[styles.underline, { backgroundColor: theme.colors.primary }]} />
        <Text style={[styles.subtitle, { color: theme.colors.textLight }]}>Please review your booking details</Text>
      </Animated.View>

      {/* Worker Details */}
      <Animated.View style={[styles.section, animatedStyle(workerAnim)]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Worker Details</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.backgroundLight, borderColor: theme.colors.border }]}>
          <Image source={worker.image} style={styles.workerImage} />
          <View style={styles.workerInfo}>
            <View style={styles.workerNameRow}>
              <Text style={[styles.workerName, { color: theme.colors.text }]}>{worker.name}</Text>
              {worker.verified && <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.primary} />}
            </View>
            <Text style={[styles.workerCategory, { color: theme.colors.textLight }]}>{worker.category}</Text>
            <View style={styles.workerMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="star-outline" size={14} color={theme.colors.warning} />
                <Text style={[styles.metaText, { color: theme.colors.textLight }]}>{worker.rating}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="briefcase-outline" size={14} color={theme.colors.textLight} />
                <Text style={[styles.metaText, { color: theme.colors.textLight }]}>{worker.completedJobs} jobs</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={theme.colors.textLight} />
                <Text style={[styles.metaText, { color: theme.colors.textLight }]}>{worker.estimatedArrival}</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Service Details */}
      <Animated.View style={[styles.section, animatedStyle(serviceAnim)]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service Details</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.backgroundLight, borderColor: theme.colors.border }]}>
          <View style={styles.detailRow}>
            <Ionicons name="construct-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
            <View style={styles.detailInfo}>
              <Text style={[styles.detailLabel, { color: theme.colors.textLight }]}>Service Type</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{bookingDetails.serviceType}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
            <View style={styles.detailInfo}>
              <Text style={[styles.detailLabel, { color: theme.colors.textLight }]}>Scheduled Time</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{bookingDetails.scheduledTime}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="hourglass-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
            <View style={styles.detailInfo}>
              <Text style={[styles.detailLabel, { color: theme.colors.textLight }]}>Estimated Duration</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{bookingDetails.estimatedDuration}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
            <View style={styles.detailInfo}>
              <Text style={[styles.detailLabel, { color: theme.colors.textLight }]}>Location</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{userLocation.address}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Pricing */}
      <Animated.View style={[styles.section, animatedStyle(pricingAnim)]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Pricing</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.backgroundLight, borderColor: theme.colors.border }]}>
          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.text }]}>Service Fee</Text>
            <Text style={[styles.pricingValue, { color: theme.colors.text }]}>₹{bookingDetails.totalAmount}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={[styles.pricingLabel, { color: theme.colors.text }]}>Platform Fee</Text>
            <Text style={[styles.pricingValue, { color: theme.colors.text }]}>₹{serviceFee}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.pricingRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>₹{totalAmount}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Payment Method */}
      <Animated.View style={[styles.section, animatedStyle(paymentAnim)]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Method</Text>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.colors.backgroundLight, borderColor: theme.colors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="card-outline" size={20} color={theme.colors.primary} style={styles.paymentIcon} />
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentMethod, { color: theme.colors.text }]}>Visa •••• 1234</Text>
            <Text style={[styles.paymentNote, { color: theme.colors.textLight }]}>
              Charged after service completion
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textLight} />
        </TouchableOpacity>
      </Animated.View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: theme.colors.background }]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelButtonText, { color: theme.colors.textLight }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: theme.colors.primary }]}
          onPress={onConfirm}
          activeOpacity={0.7}
        >
          <Text style={[styles.confirmButtonText, { color: theme.colors.background }]}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  underline: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Glassmorphism effect
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  workerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
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
    fontWeight: "500",
    marginRight: 6,
  },
  workerCategory: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 8,
  },
  workerMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 15,
    fontWeight: "400",
  },
  pricingValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 2,
  },
  paymentNote: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  confirmButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default BookingConfirmation;