"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Alert,
  Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

interface HelpCategory {
  id: string
  title: string
  icon: string
  description: string
  color: string
}

const HelpSupportScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const helpCategories: HelpCategory[] = [
    {
      id: "booking",
      title: "Booking & Scheduling",
      icon: "📅",
      description: "Help with bookings, cancellations, and scheduling",
      color: "#3B82F6",
    },
    {
      id: "payment",
      title: "Payment & Billing",
      icon: "💳",
      description: "Payment methods, invoices, and billing issues",
      color: "#10B981",
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: "👤",
      description: "Account settings, profile updates, and security",
      color: "#8B5CF6",
    },
    {
      id: "technical",
      title: "Technical Issues",
      icon: "⚙️",
      description: "App problems, bugs, and technical support",
      color: "#F59E0B",
    },
  ]

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "How do I book a service?",
      answer:
        "To book a service, go to the main screen, select your desired service, choose a professional, pick a time slot, and confirm your booking with payment.",
      category: "booking",
    },
    {
      id: "2",
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes, you can cancel or reschedule up to 2 hours before the scheduled time. Go to your booking details and select the appropriate option.",
      category: "booking",
    },
    {
      id: "3",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and bank transfers.",
      category: "payment",
    },
    {
      id: "4",
      question: "How do I update my profile information?",
      answer:
        "Go to Settings > Profile, where you can update your personal information, contact details, and preferences.",
      category: "account",
    },
    {
      id: "5",
      question: "The app is not working properly, what should I do?",
      answer:
        "Try restarting the app first. If the problem persists, check for app updates or contact our technical support team.",
      category: "technical",
    },
    {
      id: "6",
      question: "How do I add a service professional to favorites?",
      answer:
        "On any professional's profile, tap the heart icon to add them to your favorites. You can manage favorites from the Favorites tab.",
      category: "booking",
    },
  ]

  const contactOptions = [
    {
      id: "phone",
      title: "Call Us",
      subtitle: "+1 (555) 123-4567",
      icon: "📞",
      color: "#10B981",
      action: () => Linking.openURL("tel:+15551234567"),
    },
    {
      id: "email",
      title: "Email Support",
      subtitle: "support@serviceapp.com",
      icon: "✉️",
      color: "#3B82F6",
      action: () => Linking.openURL("mailto:support@serviceapp.com"),
    },
    {
      id: "chat",
      title: "Live Chat",
      subtitle: "Available 24/7",
      icon: "💬",
      color: "#8B5CF6",
      action: () => Alert.alert("Live Chat", "Opening chat support..."),
    },
    {
      id: "emergency",
      title: "Emergency Support",
      subtitle: "Urgent issues only",
      icon: "🚨",
      color: "#EF4444",
      action: () => Alert.alert("Emergency Support", "Connecting to emergency support..."),
    },
  ]

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>We're here to help you 24/7</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Quick Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          <View style={styles.contactGrid}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.contactCard, { borderLeftColor: option.color }]}
                onPress={option.action}
              >
                <Text style={styles.contactIcon}>{option.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <Text style={styles.contactArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Help Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity
              style={[styles.categoryChip, selectedCategory === "all" && styles.categoryChipActive]}
              onPress={() => setSelectedCategory("all")}
            >
              <Text style={[styles.categoryChipText, selectedCategory === "all" && styles.categoryChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {helpCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, selectedCategory === category.id && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[styles.categoryChipText, selectedCategory === category.id && styles.categoryChipTextActive]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFAQs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🤔</Text>
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>Try adjusting your search or browse different categories</Text>
            </View>
          ) : (
            filteredFAQs.map((faq) => (
              <TouchableOpacity key={faq.id} style={styles.faqItem} onPress={() => toggleFAQ(faq.id)}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={[styles.faqToggle, expandedFAQ === faq.id && styles.faqToggleExpanded]}>
                    {expandedFAQ === faq.id ? "−" : "+"}
                  </Text>
                </View>
                {expandedFAQ === faq.id && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <View style={styles.resourcesContainer}>
            <TouchableOpacity style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>📖</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>User Guide</Text>
                <Text style={styles.resourceSubtitle}>Complete app tutorial</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>🎥</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Video Tutorials</Text>
                <Text style={styles.resourceSubtitle}>Step-by-step guides</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>💡</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Tips & Tricks</Text>
                <Text style={styles.resourceSubtitle}>Get the most out of the app</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Ticket */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.submitTicketButton}>
            <Text style={styles.submitTicketIcon}>🎫</Text>
            <View style={styles.submitTicketInfo}>
              <Text style={styles.submitTicketTitle}>Submit a Support Ticket</Text>
              <Text style={styles.submitTicketSubtitle}>
                Can't find what you're looking for? Create a support ticket
              </Text>
            </View>
            <Text style={styles.submitTicketArrow}>→</Text>
          </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  contactGrid: {
    paddingHorizontal: 16,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  contactArrow: {
    fontSize: 18,
    color: "#9CA3AF",
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginRight: 12,
  },
  faqToggle: {
    fontSize: 20,
    color: "#6B7280",
    fontWeight: "bold",
  },
  faqToggleExpanded: {
    color: "#3B82F6",
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  resourcesContainer: {
    paddingHorizontal: 16,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resourceIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  submitTicketButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitTicketIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  submitTicketInfo: {
    flex: 1,
  },
  submitTicketTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  submitTicketSubtitle: {
    fontSize: 14,
    color: "#DBEAFE",
  },
  submitTicketArrow: {
    fontSize: 18,
    color: "#FFFFFF",
  },
})

export default HelpSupportScreen
