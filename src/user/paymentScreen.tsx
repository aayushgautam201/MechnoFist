import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/themeContext";

// Define PaymentMethod type
interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet";
  name: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  provider: string;
}

const PaymentMethodsScreen: React.FC = () => {
  const { theme } = useTheme(); // Use theme from context
  const navigation = useNavigation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa ending in 1234",
      last4: "1234",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      provider: "Visa",
    },
    {
      id: "2",
      type: "upi",
      name: "Google Pay",
      isDefault: false,
      provider: "Google Pay",
    },
    {
      id: "3",
      type: "wallet",
      name: "Paytm Wallet",
      isDefault: false,
      provider: "Paytm",
    },
  ]);

  // Animation state for cards
  const animatedValues = paymentMethods.map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(20),
  }));

  useEffect(() => {
    // Animate cards on mount
    Animated.parallel(
      animatedValues.map((anim, index) =>
        Animated.sequence([
          Animated.delay(index * 100), // Stagger animation
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(anim.translateY, {
              toValue: 0,
              speed: 12,
              bounciness: 8,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ),
    ).start();
  }, [paymentMethods]);

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert("Delete Payment Method", "Are you sure you want to delete this payment method?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
        },
      },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const getPaymentIcon = (type: string, provider: string): string => {
    switch (type) {
      case "card":
        return "card-outline";
      case "upi":
        return provider === "Google Pay" ? "logo-google" : "qr-code-outline";
      case "wallet":
        return "wallet-outline";
      default:
        return "card-outline";
    }
  };

  const getPaymentColor = (provider: string): string => {
    switch (provider) {
      case "Visa":
        return theme.colors.blue;
      case "Google Pay":
        return "#4285F4"; // Google Pay brand color
      case "Paytm":
        return "#00BAF2"; // Paytm brand color
      default:
        return theme.colors.primary;
    }
  };

  const PaymentMethodCard: React.FC<{ method: PaymentMethod; index: number }> = ({ method, index }) => {
    const scaleAnim = new Animated.Value(1); // For press animation

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        speed: 20,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 20,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.paymentCard,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            opacity: animatedValues[index].opacity,
            transform: [{ translateY: animatedValues[index].translateY }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.paymentCardHeader}>
          <View style={styles.paymentCardLeft}>
            <View
              style={[
                styles.paymentIcon,
                { backgroundColor: `${getPaymentColor(method.provider)}20` },
              ]}
            >
              <Ionicons
                name={getPaymentIcon(method.type, method.provider)}
                size={28}
                color={getPaymentColor(method.provider)}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentName, { color: theme.colors.text }]}>{method.name}</Text>
              {method.expiryMonth && method.expiryYear && (
                <Text style={[styles.paymentExpiry, { color: theme.colors.textLight }]}>
                  Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                </Text>
              )}
              {method.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: theme.colors.primarySoft }]}>
                  <Text style={[styles.defaultText, { color: theme.colors.primary }]}>Default</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.moreButton, { backgroundColor: theme.colors.backgroundLight }]}
            onPress={() => {
              Alert.alert("Payment Method Options", "", [
                {
                  text: "Set as Default",
                  onPress: () => handleSetDefault(method.id),
                  style: method.isDefault ? "cancel" : "default",
                },
                {
                  text: "Delete",
                  onPress: () => handleDeletePaymentMethod(method.id),
                  style: "destructive",
                },
                { text: "Cancel", style: "cancel" },
              ]);
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundSoft }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payment Methods</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert("Add Payment Method", "Feature coming soon!")}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Payment Methods
          </Text>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <PaymentMethodCard key={method.id} method={method} index={index} />
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textLight }]}>
              No payment methods added yet.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.addPaymentButton,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.primary },
          ]}
          onPress={() => Alert.alert("Add Payment Method", "Feature coming soon!")}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.addPaymentText, { color: theme.colors.primary }]}>
            Add New Payment Method
          </Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Secure Payments</Text>
              <Text style={[styles.infoText, { color: theme.colors.textLight }]}>
                Your payment information is encrypted and stored securely. We never store your full card details.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    // paddingTop: 48,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)", // Fallback shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    borderRadius: 12,
    marginVertical: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  paymentCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "rgba(0, 0, 0, 0.1)", // Fallback shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  paymentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  paymentExpiry: {
    fontSize: 14,
    marginBottom: 4,
  },
  defaultBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "600",
  },
  moreButton: {
    padding: 8,
    borderRadius: 8,
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PaymentMethodsScreen;