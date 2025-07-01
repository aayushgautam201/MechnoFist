"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  StatusBar,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../contexts/themeContext"
import man from "../images/man.jpg"

const { width, height } = Dimensions.get("window")

interface PersonalDetails {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  pincode: string
  emergencyContact: string
  emergencyContactName: string
  experience: string
  languages: string[]
}

interface Skill {
  id: string
  name: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  verified: boolean
}

interface Certification {
  id: string
  title: string
  issuedBy: string
  issueDate: string
  expiryDate?: string
  credentialId: string
  verified: boolean
  imageUrl?: string
}

interface Award {
  id: string
  title: string
  description: string
  awardedBy: string
  date: string
  imageUrl?: string
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}

interface KYCDocument {
  id: string
  type: "Aadhaar" | "PAN" | "Driving License" | "Passport"
  status: "Verified" | "Pending" | "Rejected" | "Not Uploaded"
  uploadDate?: string
  rejectionReason?: string
}

const EmployeeProfileScreen: React.FC = () => {
  const { theme, isDark } = useTheme()
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<"personal" | "skills" | "certificates" | "kyc">("personal")
  const [isEditing, setIsEditing] = useState(false)

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: "Rajesh Kumar Singh",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    dateOfBirth: "15/08/1985",
    address: "A-204, Green Valley Apartments",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    emergencyContact: "+91 98765 43211",
    emergencyContactName: "Sunita Singh (Wife)",
    experience: "8 years",
    languages: ["Hindi", "English", "Punjabi"],
  })

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: "1",
      name: "Electrical Wiring",
      category: "Electrical",
      level: "Expert",
      verified: true,
    },
    {
      id: "2",
      name: "Panel Installation",
      category: "Electrical",
      level: "Advanced",
      verified: true,
    },
    {
      id: "3",
      name: "AC Repair",
      category: "HVAC",
      level: "Intermediate",
      verified: false,
    },
    {
      id: "4",
      name: "Home Automation",
      category: "Smart Home",
      level: "Advanced",
      verified: true,
    },
  ])

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      title: "Certified Electrical Technician",
      issuedBy: "National Institute of Electronics",
      issueDate: "15/03/2020",
      expiryDate: "15/03/2025",
      credentialId: "CET-2020-1234",
      verified: true,
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300",
    },
    {
      id: "2",
      title: "Safety Training Certificate",
      issuedBy: "Occupational Safety Institute",
      issueDate: "10/01/2021",
      expiryDate: "10/01/2024",
      credentialId: "STC-2021-5678",
      verified: true,
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300",
    },
  ])

  const [awards, setAwards] = useState<Award[]>([
    {
      id: "1",
      title: "Best Technician of the Month",
      description: "Awarded for exceptional service quality and customer satisfaction",
      awardedBy: "ServicePro Platform",
      date: "December 2023",
      imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=300",
    },
    {
      id: "2",
      title: "5-Star Service Excellence",
      description: "Maintained 5-star rating for 6 consecutive months",
      awardedBy: "Customer Reviews",
      date: "November 2023",
    },
  ])

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: "1",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/rajeshkumar",
      icon: "logo-linkedin",
    },
    {
      id: "2",
      platform: "Instagram",
      url: "https://instagram.com/rajesh_electrician",
      icon: "logo-instagram",
    },
  ])

  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([
    {
      id: "1",
      type: "Aadhaar",
      status: "Verified",
      uploadDate: "10/01/2024",
    },
    {
      id: "2",
      type: "PAN",
      status: "Verified",
      uploadDate: "10/01/2024",
    },
    {
      id: "3",
      type: "Driving License",
      status: "Pending",
      uploadDate: "15/01/2024",
    },
    {
      id: "4",
      type: "Passport",
      status: "Not Uploaded",
    },
  ])

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "#10B981"
      case "Pending":
        return "#F59E0B"
      case "Rejected":
        return "#EF4444"
      case "Not Uploaded":
        return "#6B7280"
      default:
        return "#6B7280"
    }
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "#8B5CF6"
      case "Advanced":
        return "#3B82F6"
      case "Intermediate":
        return "#F59E0B"
      case "Beginner":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const NavigationHeader = () => (
    <View style={[styles.navBar, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Text style={[styles.navTitle, { color: theme.colors.text }]}>Profile</Text>

      <TouchableOpacity
        style={[styles.editToggle, isEditing && { backgroundColor: theme.colors.primary }]}
        onPress={() => setIsEditing(!isEditing)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isEditing ? "checkmark" : "create-outline"}
          size={20}
          color={isEditing ? "#FFFFFF" : theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  )

  const ProfileCard = () => (
    <View style={[styles.profileCard, { backgroundColor: theme.colors.backgroundLight }]}>
      <View style={styles.profileImageContainer}>
        <Image source={man} style={styles.profileImage} />
        <View style={styles.onlineIndicator} />
        <TouchableOpacity style={styles.cameraOverlay} activeOpacity={0.8}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileDetails}>
        <Text style={[styles.profileName, { color: theme.colors.text }]}>{personalDetails.fullName}</Text>
        <Text style={[styles.profileTitle, { color: theme.colors.textLight }]}>Senior Electrician</Text>

        <View style={styles.verificationRow}>
          <View style={styles.verificationBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text style={styles.verifiedText}>Verified Professional</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>4.9</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>156</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Jobs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>8Y</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textLight }]}>Experience</Text>
        </View>
      </View>
    </View>
  )

  const TabNavigation = () => (
    <View style={[styles.tabNavigation, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.backgroundLight }]}>
        {[
          { key: "personal", icon: "person-outline", label: "Personal" },
          { key: "skills", icon: "build-outline", label: "Skills" },
          { key: "certificates", icon: "medal-outline", label: "Certificates" },
          { key: "kyc", icon: "shield-checkmark-outline", label: "KYC" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && [styles.activeTabButton, { backgroundColor: theme.colors.primary }],
            ]}
            onPress={() => setActiveTab(tab.key as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.key ? "#FFFFFF" : theme.colors.textLight}
            />
            <Text style={[styles.tabLabel, { color: activeTab === tab.key ? "#FFFFFF" : theme.colors.textLight }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const PersonalDetailsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <ProfileCard />
      
      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Information</Text>
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.inputField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textLight }]}>Full Name</Text>
            <TextInput
              style={[styles.fieldInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
              value={personalDetails.fullName}
              editable={isEditing}
              placeholderTextColor={theme.colors.textLight}
            />
          </View>

          <View style={styles.inputField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textLight }]}>Email Address</Text>
            <TextInput
              style={[styles.fieldInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
              value={personalDetails.email}
              editable={isEditing}
              placeholderTextColor={theme.colors.textLight}
            />
          </View>

          <View style={styles.inputField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textLight }]}>Phone Number</Text>
            <TextInput
              style={[styles.fieldInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
              value={personalDetails.phone}
              editable={isEditing}
              placeholderTextColor={theme.colors.textLight}
            />
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Location</Text>
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.inputField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textLight }]}>Address</Text>
            <TextInput
              style={[
                styles.fieldInput,
                styles.multilineInput,
                { color: theme.colors.text, backgroundColor: theme.colors.background },
              ]}
              value={personalDetails.address}
              editable={isEditing}
              multiline
              placeholderTextColor={theme.colors.textLight}
            />
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.inputField, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textLight }]}>City</Text>
              <TextInput
                style={[styles.fieldInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                value={personalDetails.city}
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>
            <View style={[styles.inputField, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textLight }]}>Pincode</Text>
              <TextInput
                style={[styles.fieldInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                value={personalDetails.pincode}
                editable={isEditing}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="link" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Social Links</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.socialLinksContainer}>
          {socialLinks.map((link) => (
            <View key={link.id} style={[styles.socialLinkCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.socialIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name={link.icon as any} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.socialInfo}>
                <Text style={[styles.socialPlatform, { color: theme.colors.text }]}>{link.platform}</Text>
                <Text style={[styles.socialUrl, { color: theme.colors.textLight }]} numberOfLines={1}>
                  {link.url}
                </Text>
              </View>
              <TouchableOpacity style={styles.editIcon} activeOpacity={0.7}>
                <Ionicons name="create-outline" size={16} color={theme.colors.textLight} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )

  const SkillsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="build" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Professional Skills</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.skillsGrid}>
          {skills.map((skill) => (
            <View key={skill.id} style={[styles.skillCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.skillHeader}>
                <Text style={[styles.skillName, { color: theme.colors.text }]}>{skill.name}</Text>
                {skill.verified && (
                  <View style={styles.verifiedIcon}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  </View>
                )}
              </View>
              <Text style={[styles.skillCategory, { color: theme.colors.textLight }]}>{skill.category}</Text>
              <View style={[styles.skillLevel, { backgroundColor: getSkillLevelColor(skill.level) }]}>
                <Text style={styles.skillLevelText}>{skill.level}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="grid" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service Categories</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {["Electrical", "HVAC", "Smart Home", "Safety"].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryChip, { borderColor: theme.colors.primary }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryText, { color: theme.colors.primary }]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  )

  const CertificatesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medal" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Certifications</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.certificatesContainer}>
          {certifications.map((cert) => (
            <View key={cert.id} style={[styles.certificateCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.certificateHeader}>
                <View style={[styles.certificateIcon, { backgroundColor: "#F0F9FF" }]}>
                  <Ionicons name="document-text" size={24} color="#0284C7" />
                </View>
                {cert.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                    <Text style={styles.verifiedBadgeText}>Verified</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.certificateTitle, { color: theme.colors.text }]}>{cert.title}</Text>
              <Text style={[styles.certificateIssuer, { color: theme.colors.textLight }]}>{cert.issuedBy}</Text>

              <View style={styles.certificateDetails}>
                <Text style={[styles.certificateDate, { color: theme.colors.textLight }]}>
                  Issued: {cert.issueDate}
                </Text>
                {cert.expiryDate && (
                  <Text style={[styles.certificateDate, { color: theme.colors.textLight }]}>
                    Expires: {cert.expiryDate}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="trophy" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Awards & Recognition</Text>
        </View>

        <View style={styles.awardsContainer}>
          {awards.map((award) => (
            <View key={award.id} style={[styles.awardCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.awardIcon}>
                <Ionicons name="trophy" size={24} color="#F59E0B" />
              </View>
              <View style={styles.awardContent}>
                <Text style={[styles.awardTitle, { color: theme.colors.text }]}>{award.title}</Text>
                <Text style={[styles.awardDescription, { color: theme.colors.textLight }]}>{award.description}</Text>
                <Text style={[styles.awardDate, { color: theme.colors.textLight }]}>
                  {award.awardedBy} • {award.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )

  const KYCTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.kycStatusCard}>
          <View style={styles.kycStatusIcon}>
            <Ionicons name="shield-checkmark" size={32} color="#10B981" />
          </View>
          <Text style={[styles.kycStatusTitle, { color: theme.colors.text }]}>Profile Verified</Text>
          <Text style={[styles.kycStatusSubtitle, { color: theme.colors.textLight }]}>2 of 4 documents verified</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "50%" }]} />
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.backgroundLight }]}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document" size={20} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Identity Documents</Text>
        </View>

        <View style={styles.documentsContainer}>
          {kycDocuments.map((doc) => (
            <View key={doc.id} style={[styles.documentCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.documentInfo}>
                <Text style={[styles.documentType, { color: theme.colors.text }]}>{doc.type}</Text>
                {doc.uploadDate && (
                  <Text style={[styles.documentDate, { color: theme.colors.textLight }]}>
                    Uploaded: {doc.uploadDate}
                  </Text>
                )}
              </View>

              <View style={styles.documentActions}>
                <View style={[styles.statusBadge, { backgroundColor: getKYCStatusColor(doc.status) }]}>
                  <Text style={styles.statusBadgeText}>{doc.status}</Text>
                </View>

                {doc.status === "Not Uploaded" || doc.status === "Rejected" ? (
                  <TouchableOpacity style={styles.uploadButton} activeOpacity={0.7}>
                    <Ionicons name="cloud-upload" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.viewButton} activeOpacity={0.7}>
                    <Ionicons name="eye" size={16} color={theme.colors.textLight} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalDetailsTab />
      case "skills":
        return <SkillsTab />
      case "certificates":
        return <CertificatesTab />
      case "kyc":
        return <KYCTab />
      default:
        return <PersonalDetailsTab />
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <NavigationHeader />
      <TabNavigation />
      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  navTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  editToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },

  profileCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  profileImageContainer: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  profileDetails: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  verificationRow: {
    alignItems: "center",
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.08)",
    gap: 24,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },

  tabNavigation: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  activeTabButton: {
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },

  contentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 24,
  },

  section: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  fieldGroup: {
    gap: 16,
  },
  inputField: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  fieldInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "500",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  rowFields: {
    flexDirection: "row",
  },

  socialLinksContainer: {
    gap: 12,
  },
  socialLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  socialInfo: {
    flex: 1,
  },
  socialPlatform: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  socialUrl: {
    fontSize: 13,
    fontWeight: "400",
  },
  editIcon: {
    padding: 8,
  },

  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  skillCard: {
    width: (width - 88) / 2,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  skillName: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  skillCategory: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 12,
  },
  skillLevel: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  skillLevelText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
  },

  certificatesContainer: {
    gap: 16,
  },
  certificateCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  certificateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  certificateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10B981",
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  certificateIssuer: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  certificateDetails: {
    gap: 4,
  },
  certificateDate: {
    fontSize: 12,
    fontWeight: "500",
  },

  awardsContainer: {
    gap: 16,
  },
  awardCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    gap: 16,
  },
  awardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  awardContent: {
    flex: 1,
  },
  awardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  awardDescription: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 8,
    lineHeight: 20,
  },
  awardDate: {
    fontSize: 12,
    fontWeight: "500",
  },

  kycStatusCard: {
    alignItems: "center",
    paddingVertical: 20,
  },
  kycStatusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  kycStatusTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  kycStatusSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
  },
  progressBar: {
    width: 200,
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },

  documentsContainer: {
    gap: 12,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  documentInfo: {
    flex: 1,
  },
  documentType: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  documentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  uploadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default EmployeeProfileScreen