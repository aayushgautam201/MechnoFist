"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

interface SettingItem {
  id: string
  title: string
  subtitle?: string
  icon: string
  type: "toggle" | "navigation" | "action"
  value?: boolean
  onPress?: () => void
  onToggle?: (value: boolean) => void
  color?: string
}

interface SettingSection {
  id: string
  title: string
  items: SettingItem[]
}

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [autoBookingEnabled, setAutoBookingEnabled] = useState(true)
  const [marketingEnabled, setMarketingEnabled] = useState(false)

  const settingSections: SettingSection[] = [
    {
      id: "account",
      title: "Account",
      items: [
        {
          id: "profile",
          title: "Edit Profile",
          subtitle: "Update your personal information",
          icon: "👤",
          type: "navigation",
          onPress: () => Alert.alert("Profile", "Opening profile settings..."),
        },
        {
          id: "payment",
          title: "Payment Methods",
          subtitle: "Manage cards and payment options",
          icon: "💳",
          type: "navigation",
          onPress: () => Alert.alert("Payment", "Opening payment settings..."),
        },
        {
          id: "addresses",
          title: "Saved Addresses",
          subtitle: "Manage your service locations",
          icon: "📍",
          type: "navigation",
          onPress: () => Alert.alert("Addresses", "Opening address management..."),
        },
      ],
    },
    {
      id: "preferences",
      title: "Preferences",
      items: [
        {
          id: "notifications",
          title: "Push Notifications",
          subtitle: "Receive booking updates and reminders",
          icon: "🔔",
          type: "toggle",
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: "location",
          title: "Location Services",
          subtitle: "Allow location access for better service",
          icon: "📍",
          type: "toggle",
          value: locationEnabled,
          onToggle: setLocationEnabled,
        },
        {
          id: "darkmode",
          title: "Dark Mode",
          subtitle: "Switch to dark theme",
          icon: "🌙",
          type: "toggle",
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          id: "language",
          title: "Language",
          subtitle: "English (US)",
          icon: "🌐",
          type: "navigation",
          onPress: () => Alert.alert("Language", "Opening language settings..."),
        },
      ],
    },
    {
      id: "security",
      title: "Security & Privacy",
      items: [
        {
          id: "biometric",
          title: "Biometric Login",
          subtitle: "Use fingerprint or face ID",
          icon: "🔐",
          type: "toggle",
          value: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
        {
          id: "password",
          title: "Change Password",
          subtitle: "Update your account password",
          icon: "🔑",
          type: "navigation",
          onPress: () => Alert.alert("Password", "Opening password change..."),
        },
        {
          id: "privacy",
          title: "Privacy Settings",
          subtitle: "Control your data and privacy",
          icon: "🛡️",
          type: "navigation",
          onPress: () => Alert.alert("Privacy", "Opening privacy settings..."),
        },
        {
          id: "twofactor",
          title: "Two-Factor Authentication",
          subtitle: "Add extra security to your account",
          icon: "🔒",
          type: "navigation",
          onPress: () => Alert.alert("2FA", "Opening two-factor authentication..."),
        },
      ],
    },
    {
      id: "booking",
      title: "Booking Preferences",
      items: [
        {
          id: "autobooking",
          title: "Auto-booking",
          subtitle: "Automatically book with favorite professionals",
          icon: "⚡",
          type: "toggle",
          value: autoBookingEnabled,
          onToggle: setAutoBookingEnabled,
        },
        {
          id: "reminders",
          title: "Booking Reminders",
          subtitle: "Get notified before appointments",
          icon: "⏰",
          type: "navigation",
          onPress: () => Alert.alert("Reminders", "Opening reminder settings..."),
        },
        {
          id: "defaultlocation",
          title: "Default Location",
          subtitle: "Set your primary service address",
          icon: "🏠",
          type: "navigation",
          onPress: () => Alert.alert("Location", "Opening default location..."),
        },
      ],
    },
    {
      id: "communication",
      title: "Communication",
      items: [
        {
          id: "marketing",
          title: "Marketing Emails",
          subtitle: "Receive promotional offers and updates",
          icon: "📧",
          type: "toggle",
          value: marketingEnabled,
          onToggle: setMarketingEnabled,
        },
        {
          id: "sms",
          title: "SMS Notifications",
          subtitle: "Receive text message updates",
          icon: "💬",
          type: "navigation",
          onPress: () => Alert.alert("SMS", "Opening SMS settings..."),
        },
      ],
    },
    {
      id: "support",
      title: "Support & Legal",
      items: [
        {
          id: "help",
          title: "Help Center",
          subtitle: "Get help and support",
          icon: "❓",
          type: "navigation",
          onPress: () => Alert.alert("Help", "Opening help center..."),
        },
        {
          id: "contact",
          title: "Contact Us",
          subtitle: "Get in touch with our team",
          icon: "📞",
          type: "navigation",
          onPress: () => Alert.alert("Contact", "Opening contact options..."),
        },
        {
          id: "terms",
          title: "Terms of Service",
          subtitle: "Read our terms and conditions",
          icon: "📄",
          type: "navigation",
          onPress: () => Alert.alert("Terms", "Opening terms of service..."),
        },
        {
          id: "privacy-policy",
          title: "Privacy Policy",
          subtitle: "Learn about our privacy practices",
          icon: "🔒",
          type: "navigation",
          onPress: () => Alert.alert("Privacy Policy", "Opening privacy policy..."),
        },
      ],
    },
    {
      id: "account-actions",
      title: "Account Actions",
      items: [
        {
          id: "logout",
          title: "Sign Out",
          subtitle: "Sign out of your account",
          icon: "🚪",
          type: "action",
          color: "#EF4444",
          onPress: () =>
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", style: "destructive" },
            ]),
        },
        {
          id: "delete",
          title: "Delete Account",
          subtitle: "Permanently delete your account",
          icon: "🗑️",
          type: "action",
          color: "#DC2626",
          onPress: () =>
            Alert.alert("Delete Account", "This action cannot be undone. Are you sure?", [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive" },
            ]),
        },
      ],
    },
  ]

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === "toggle"}
      >
        <View style={styles.settingLeft}>
          <Text style={styles.settingIcon}>{item.icon}</Text>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, item.color && { color: item.color }]}>{item.title}</Text>
            {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {item.type === "toggle" ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor={item.value ? "#FFFFFF" : "#FFFFFF"}
            />
          ) : (
            <Text style={styles.settingArrow}>→</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Premium Member</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileEditButton}>
            <Text style={styles.profileEditText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>{section.items.map(renderSettingItem)}</View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>ServiceApp v2.1.0</Text>
          <Text style={styles.appInfoText}>© 2024 ServiceApp Inc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#92400E",
  },
  profileEditButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileEditText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  settingRight: {
    marginLeft: 16,
  },
  settingArrow: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  appInfo: {
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
})

export default SettingsScreen
