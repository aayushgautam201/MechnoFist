import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

// Color palette based on #10B981
const colors = {
  primary: "#10B981", // Main emerald green
  primaryLight: "#34D399", // Lighter green
  primaryDark: "#059669", // Darker green
  surface: "#FFFFFF", // White for components and background
  text: {
    primary: "#1F2937", // Dark gray
    secondary: "#6B7280", // Medium gray
    placeholder: "#9CA3AF", // Light gray
  },
  border: "#E5E7EB", // Light border
}

interface ForgotPasswordScreenProps {}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [focusedField, setFocusedField] = useState<string>("")

  // Animations
  const buttonScale = new Animated.Value(1)
  const headerOpacity = new Animated.Value(1)
  const inputScale = new Animated.Value(1)

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start()
    })

    return () => {
      headerOpacity.setValue(1)
    }
  }, [emailSent])

  useEffect(() => {
    Animated.timing(inputScale, {
      toValue: focusedField === "email" ? 1.02 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [focusedField])

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    setIsLoading(true)
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setIsLoading(false)
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }).start()
        setEmailSent(true)
      }, 1500)
    })
  }

  const handleBackToLogin = () => {
    navigation.navigate("Login")
  }

  const handleResendEmail = () => {
    setEmailSent(false)
    handleSendResetLink()
  }

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "Contact support not implemented yet")
  }

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.backButtonTop} onPress={handleBackToLogin}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Success Header */}
          <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
            <Ionicons name="mail-outline" size={48} color={colors.primary} style={styles.successIcon} />
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </Animated.View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>What's Next?</Text>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>Check your email inbox (and spam folder)</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>Click the reset password link in the email</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>Create a new password for your account</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.resendButton, isLoading && styles.resendButtonDisabled]}
              onPress={handleResendEmail}
              disabled={isLoading}
            >
              <Text style={styles.resendButtonText}>{isLoading ? "Resending..." : "Resend Email"}</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <View style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={colors.primary} style={styles.backIcon} />
                <Text style={styles.backButtonText}>Back to Sign In</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Support Link */}
          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>Didn't receive the email? </Text>
            <TouchableOpacity onPress={handleContactSupport}>
              <Text style={styles.supportLink}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButtonTop} onPress={handleBackToLogin}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.primary} style={styles.headerIcon} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>We'll send you reset instructions</Text>
        </Animated.View>

        {/* Form */}
        <View style={styles.form}>
          <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputScale }] }]}>
            <TextInput
              style={[styles.input, focusedField === "email" && styles.inputFocused]}
              placeholder="Email address"
              placeholderTextColor={colors.text.placeholder}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              onPress={handleSendResetLink}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Support Link */}
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>Need help? </Text>
          <TouchableOpacity onPress={handleContactSupport}>
            <Text style={styles.supportLink}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topContainer: {
    paddingHorizontal: width * 0.06,
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButtonTop: {
    alignSelf: "flex-start",
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  headerIcon: {
    marginBottom: 12,
  },
  successIcon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  emailText: {
    color: colors.primary,
    fontWeight: "500",
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderRadius: 12,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    // elevation: 3,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  sendButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  resendButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  resendButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  backButtonContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  supportContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  supportText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  supportLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
})

export default ForgotPasswordScreen