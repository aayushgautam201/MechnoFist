import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {useTheme} from "../contexts/themeContext"; // Import theme context
import man from "../images/man.jpg";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme(); // Use theme context

  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    smsNotifications: true,
    emailNotifications: true,
  });

  const [userProfile, setUserProfile] = useState({
    name: "Ayush Kumar",
    email: "ayush@example.com",
    phone: "+91 98765 43210",
    profileImage: man,
    address: "123 Main Street, New Delhi, India",
    isEmailVerified: true,
    isPhoneVerified: false,
    rewardPoints: 1250,
    memberSince: "January 2023",
  });

  const handleImagePicker = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => console.log("Camera selected") },
      { text: "Gallery", onPress: () => console.log("Gallery selected") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleVerifyPhone = () => {
    Alert.alert("Verify Phone", "We'll send you a verification code via SMS", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Code", onPress: () => console.log("Verification code sent") },
    ]);
  };

  const handleVerifyEmail = () => {
    Alert.alert("Verify Email", "We'll send you a verification link", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Link", onPress: () => console.log("Verification link sent") },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
      },
    ]);
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    showChevron = true,
    verified,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
    verified?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.profileItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primarySoft }]}>
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={[styles.profileItemTitle, { color: theme.colors.text }]}>{title}</Text>
            {verified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.success}
                style={styles.verifiedBadge}
              />
            )}
            {verified === false && (
              <TouchableOpacity
                style={[styles.verifyButton, { backgroundColor: theme.colors.warning }]}
                onPress={title.includes("Phone") ? handleVerifyPhone : handleVerifyEmail}
              >
                <Text style={[styles.verifyButtonText, { color: theme.colors.background }]}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>
          {subtitle && (
            <Text style={[styles.profileItemSubtitle, { color: theme.colors.textLight }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.profileItemRight}>
        {rightElement}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textLighter} />
        )}
      </View>
    </TouchableOpacity>
  );

  const ProfileHeader = () => (
    <View
      style={[
        styles.profileHeader,
        { backgroundColor: theme.colors.backgroundLight, shadowColor: theme.colors.shadow },
      ]}
    >
      <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePicker}>
        <Image
          source={userProfile.profileImage}
          style={[styles.profileImage, { borderColor: theme.colors.primarySoft }]}
        />
        <View style={[styles.cameraIcon, { backgroundColor: theme.colors.primary, borderColor: theme.colors.backgroundLight }]}>
          <Ionicons name="camera" size={16} color={theme.colors.backgroundLight} />
        </View>
      </TouchableOpacity>
      <Text style={[styles.profileName, { color: theme.colors.text }]}>{userProfile.name}</Text>
      <Text style={[styles.profileSubtitle, { color: theme.colors.textLight }]}>
        Member since {userProfile.memberSince}
      </Text>
      <View style={[styles.rewardCard, { backgroundColor: theme.colors.primarySoft }]}>
        <Ionicons name="gift" size={20} color={theme.colors.warning} style={styles.rewardIcon} />
        <View style={styles.rewardInfo}>
          <Text style={[styles.rewardPoints, { color: theme.colors.primary }]}>
            {userProfile.rewardPoints} Points
          </Text>
          <Text style={[styles.rewardText, { color: theme.colors.textLight }]}>Available to redeem</Text>
        </View>
        <TouchableOpacity
          style={[styles.redeemButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("RewardPointScreen")}
        >
          <Text style={[styles.redeemButtonText, { color: theme.colors.backgroundLight }]}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundSoft }]}>
      <View style={[ styles.header, { backgroundColor: theme.colors.backgroundLight, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => console.log("Edit profile")}>
          <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader />

        <ProfileSection title="Contact Information">
          <ProfileItem
            icon="call-outline"
            title="Phone Number"
            subtitle={userProfile.phone}
            verified={userProfile.isPhoneVerified}
          />
          <ProfileItem
            icon="mail-outline"
            title="Email Address"
            subtitle={userProfile.email}
            verified={userProfile.isEmailVerified}
          />
          <ProfileItem
            icon="home-outline"
            title="Address"
            subtitle={userProfile.address}
            onPress={() => console.log("Edit address")}
          />
        </ProfileSection>

        <ProfileSection title="Account">
          <ProfileItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update personal info"
            onPress={() => console.log("Edit profile")}
          />
          <ProfileItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => console.log("Change password")}
          />
          <ProfileItem
            icon="calendar-outline"
            title="My Bookings"
            subtitle="View booking history"
            onPress={() => navigation.navigate("BookingsStack")}
          />
        </ProfileSection>

        <ProfileSection title="Notifications">
          {[
            { key: "pushNotifications", title: "Push Notifications", icon: "notifications-outline" },
            { key: "smsNotifications", title: "SMS Notifications", icon: "chatbubble-outline" },
            { key: "emailNotifications", title: "Email Notifications", icon: "mail-outline" },
          ].map(({ key, title, icon }) => (
            <ProfileItem
              key={key}
              icon={icon}
              title={title}
              rightElement={
                <Switch
                  value={notificationSettings[key]}
                  onValueChange={(value) => updateNotificationSetting(key, value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                  thumbColor={notificationSettings[key] ? theme.colors.primary : theme.colors.backgroundLight}
                />
              }
              showChevron={false}
            />
          ))}
        </ProfileSection>

        <ProfileSection title="Settings">
          <ProfileItem
            icon="moon-outline"
            title="Dark Mode"
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={isDark ? theme.colors.primary : theme.colors.backgroundLight}
              />
            }
            showChevron={false}
          />
          <ProfileItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => console.log("Language settings")}
          />
        </ProfileSection>

        <ProfileSection title="Support & Legal">
          <ProfileItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help when you need it"
            onPress={() => console.log("Help & Support")}
          />
          <ProfileItem
            icon="document-text-outline"
            title="Terms & Conditions"
            onPress={() => console.log("Terms")}
          />
          <ProfileItem
            icon="information-circle-outline"
            title="Privacy Policy"
            onPress={() => console.log("Privacy Policy")}
          />
        </ProfileSection>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.colors.backgroundLight, borderColor: theme.colors.error }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
        </TouchableOpacity>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    width: "100%",
  },
  rewardIcon: {
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardPoints: {
    fontSize: 16,
    fontWeight: "600",
  },
  rewardText: {
    fontSize: 12,
  },
  redeemButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    padding: 16,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  profileItemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  profileItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedBadge: {
    marginLeft: 8,
  },
  verifyButton: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProfileScreen;