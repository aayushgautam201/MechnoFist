import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/themeContext";

const RewardPointsScreen = () => {
  const { theme } = useTheme(); // Use theme from context
  const navigation = useNavigation();
  const [currentPoints] = useState(1250);
  const [transactions] = useState([
    {
      id: "1",
      type: "earned",
      points: 50,
      description: "Booking completed - Electrical work",
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "earned",
      points: 100,
      description: "Referral bonus - Friend joined",
      date: "2024-01-10",
    },
    {
      id: "3",
      type: "redeemed",
      points: -200,
      description: "Redeemed for service discount",
      date: "2024-01-05",
    },
    {
      id: "4",
      type: "earned",
      points: 25,
      description: "Review bonus - 5 star rating",
      date: "2024-01-01",
    },
  ]);

  const rewardTiers = [
    { name: "Bronze", minPoints: 0, maxPoints: 499, color: "#CD7F32", icon: "medal-outline" },
    { name: "Silver", minPoints: 500, maxPoints: 1499, color: "#C0C0C0", icon: "medal-outline" },
    { name: "Gold", minPoints: 1500, maxPoints: 2999, color: "#FFD700", icon: "medal-outline" },
    { name: "Platinum", minPoints: 3000, maxPoints: Infinity, color: "#E5E4E2", icon: "medal-outline" },
  ];

  const getCurrentTier = () =>
    rewardTiers.find((tier) => currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints) ||
    rewardTiers[0];

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = rewardTiers.findIndex((tier) => tier.name === currentTier.name);
    return currentIndex < rewardTiers.length - 1 ? rewardTiers[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNext = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const handleRedeem = () => {
    Alert.alert("Redeem Points", "Choose how to redeem your points:", [
      { text: "Service Discount", onPress: () => console.log("Service discount selected") },
      { text: "Cash Back", onPress: () => console.log("Cash back selected") },
      { text: "Gift Voucher", onPress: () => console.log("Gift voucher selected") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const SectionHeader = ({ title }) => (
    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
  );

  const TransactionItem = ({ transaction }) => (
    <View style={[styles.transactionItem, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            {
              backgroundColor:
                transaction.type === "earned" ? theme.colors.primarySoft : "#FEF3C7",
            },
          ]}
        >
          <Ionicons
            name={transaction.type === "earned" ? "add-circle" : "remove-circle"}
            size={16}
            color={transaction.type === "earned" ? theme.colors.primary : theme.colors.warning}
          />
        </View>
        <View>
          <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
            {transaction.description}
          </Text>
          <Text style={[styles.transactionDate, { color: theme.colors.textLight }]}>
            {new Date(transaction.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.transactionPoints,
          { color: transaction.type === "earned" ? theme.colors.primary : theme.colors.warning },
        ]}
      >
        {transaction.type === "earned" ? "+" : ""}
        {transaction.points}
      </Text>
    </View>
  );

  const PointsBalance = () => (
    <View style={[styles.balanceCard, { backgroundColor: theme.colors.background }]}>
      <View style={styles.balanceHeader}>
        <Ionicons name="gift" size={24} color={theme.colors.warning} style={styles.pointsIcon} />
        <View>
          <Text style={[styles.balancePoints, { color: theme.colors.text }]}>{currentPoints}</Text>
          <Text style={[styles.balanceLabel, { color: theme.colors.textLight }]}>Available Points</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.redeemButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleRedeem}
      >
        <Text style={[styles.redeemButtonText, { color: theme.colors.background }]}>Redeem Points</Text>
      </TouchableOpacity>
    </View>
  );

  const TierProgress = () => (
    <View style={[styles.tierCard, { backgroundColor: theme.colors.background }]}>
      <View style={styles.tierHeader}>
        <View style={styles.tierTitleContainer}>
          <Ionicons
            name={currentTier.icon}
            size={18}
            color={currentTier.color}
            style={styles.tierBadge}
          />
          <Text style={[styles.tierTitle, { color: theme.colors.text }]}>{currentTier.name} Tier</Text>
        </View>
        {nextTier && (
          <Text style={[styles.tierNext, { color: theme.colors.textLight }]}>
            {nextTier.minPoints - currentPoints} points to {nextTier.name}
          </Text>
        )}
      </View>
      {nextTier && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.backgroundSoft }]}>
            <View
              style={[styles.progressFill, { width: `${progressToNext}%`, backgroundColor: currentTier.color }]}
            />
          </View>
          <Text style={[styles.progressText, { color: currentTier.color }]}>
            {Math.round(progressToNext)}%
          </Text>
        </View>
      )}
    </View>
  );

  const HowToEarn = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
      <SectionHeader title="How to Earn Points" />
      {[
        {
          icon: "checkmark-circle-outline",
          title: "Complete Bookings",
          description: "Earn 50 points for every completed service",
        },
        { icon: "people-outline", title: "Refer Friends", description: "Get 100 points when a friend joins" },
        { icon: "star-outline", title: "Leave Reviews", description: "Earn 25 points for 5-star reviews" },
      ].map((method, index) => (
        <View
          key={index}
          style={[styles.earnMethod, { borderBottomColor: theme.colors.border }]}
        >
          <Ionicons name={method.icon} size={18} color={theme.colors.primary} />
          <View style={styles.earnInfo}>
            <Text style={[styles.earnTitle, { color: theme.colors.text }]}>{method.title}</Text>
            <Text style={[styles.earnDescription, { color: theme.colors.textLight }]}>
              {method.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundSoft }]}>
      <View
        style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Reward Points</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <PointsBalance />
        <TierProgress />
        <HowToEarn />
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <SectionHeader title="Recent Activity" />
          <FlatList
            data={transactions}
            renderItem={({ item }) => <TransactionItem transaction={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.bottomSpacer} />
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  balanceCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)", // Fallback shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  pointsIcon: {
    marginRight: 12,
  },
  balancePoints: {
    fontSize: 26,
    fontWeight: "700",
  },
  balanceLabel: {
    fontSize: 13,
  },
  redeemButton: {
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  redeemButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  tierCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)", // Fallback shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tierHeader: {
    marginBottom: 12,
  },
  tierTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tierBadge: {
    marginRight: 8,
  },
  tierTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  tierNext: {
    fontSize: 12,
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: theme => theme.colors.backgroundSoft, // Dynamic in component
  },
  earnMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  earnInfo: {
    flex: 1,
    marginLeft: 12,
  },
  earnTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  earnDescription: {
    fontSize: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionPoints: {
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 32,
  },
});

export default RewardPointsScreen;