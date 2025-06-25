"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Alert,
    Animated,
    StatusBar,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useTheme } from "../contexts/themeContext"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

interface Message {
    id: string
    text: string
    sender: "user" | "professional"
    timestamp: Date
    type: "text" | "image" | "voice" | "location" | "system"
    status?: "sending" | "sent" | "delivered" | "read"
    attachment?: {
        type: string
        url: string
        name?: string
    }
}

interface Professional {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    lastSeen?: Date
    isTyping: boolean
    profession: string
}

const ChatScreen: React.FC = () => {
    const { theme, isDark } = useTheme()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const sendButtonScale = useRef(new Animated.Value(1)).current

    const professional: Professional = {
        id: "1",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        isTyping: false,
        profession: "Professional Cleaner",
    }

    // Animation on mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    // Sample messages
    useEffect(() => {
        const sampleMessages: Message[] = [
            {
                id: "1",
                text: "Hi! I'm Sarah, your assigned cleaning professional. I'll be arriving at 2:00 PM today. Looking forward to providing you with excellent service! 😊",
                sender: "professional",
                timestamp: new Date(Date.now() - 3600000),
                type: "text",
                status: "read",
            },
            {
                id: "2",
                text: "Great! I'll be ready. Do you need any special cleaning supplies or should I prepare anything specific?",
                sender: "user",
                timestamp: new Date(Date.now() - 3500000),
                type: "text",
                status: "read",
            },
            {
                id: "3",
                text: "No worries at all! I bring all my own professional-grade supplies and equipment. Is there anything specific you'd like me to focus on during the cleaning?",
                sender: "professional",
                timestamp: new Date(Date.now() - 3400000),
                type: "text",
                status: "read",
            },
            {
                id: "4",
                text: "Please pay extra attention to the kitchen and bathrooms. Also, if you could be gentle with the furniture in the living room, that would be great. Thank you!",
                sender: "user",
                timestamp: new Date(Date.now() - 3300000),
                type: "text",
                status: "read",
            },
            {
                id: "5",
                text: "Absolutely! I'll take special care of your furniture and give the kitchen and bathrooms a deep clean. I'm on my way now and should arrive in about 15 minutes. 🚗",
                sender: "professional",
                timestamp: new Date(Date.now() - 900000),
                type: "text",
                status: "read",
            },
            {
                id: "6",
                text: "📍 Sarah has shared their live location",
                sender: "professional",
                timestamp: new Date(Date.now() - 800000),
                type: "system",
                status: "delivered",
            },
        ]
        setMessages(sampleMessages)
    }, [])

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message.trim(),
                sender: "user",
                timestamp: new Date(),
                type: "text",
                status: "sending",
            }

            setMessages((prev) => [...prev, newMessage])
            setMessage("")

            // Simulate send button animation
            Animated.sequence([
                Animated.timing(sendButtonScale, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(sendButtonScale, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start()

            // Simulate message status updates
            setTimeout(() => {
                setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))
            }, 500)

            setTimeout(() => {
                setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
            }, 1000)

            setTimeout(() => {
                setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
            }, 1500)

            // Simulate professional response
            setTimeout(() => {
                const responses = [
                    "Got it! Thanks for letting me know. 👍",
                    "Perfect! I'll make sure to handle everything carefully.",
                    "Understood! I'll focus on those areas specifically.",
                    "Thanks for the details! See you soon.",
                ]
                const response: Message = {
                    id: (Date.now() + 1).toString(),
                    text: responses[Math.floor(Math.random() * responses.length)],
                    sender: "professional",
                    timestamp: new Date(),
                    type: "text",
                    status: "sent",
                }
                setMessages((prev) => [...prev, response])
            }, 2000)
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "sending":
                return "⏳"
            case "sent":
                return "✓"
            case "delivered":
                return "✓✓"
            case "read":
                return "✓✓"
            default:
                return ""
        }
    }

    const renderMessage = (msg: Message, index: number) => {
        const isUser = msg.sender === "user"
        const isSystem = msg.type === "system"

        if (isSystem) {
            return (
                <Animated.View key={msg.id} style={[styles.systemMessage, { backgroundColor: theme.colors.backgroundSoft }]}>
                    <Text style={[styles.systemMessageText, { color: theme.colors.textLight }]}>{msg.text}</Text>
                    <Text style={[styles.systemMessageTime, { color: theme.colors.textLighter }]}>
                        {formatTime(msg.timestamp)}
                    </Text>
                </Animated.View>
            )
        }

        return (
            <Animated.View
                key={msg.id}
                style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.professionalMessageContainer]}
            >
                {!isUser && (
                    <View style={[styles.professionalAvatar, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.professionalAvatarText}>SJ</Text>
                    </View>
                )}
                <View
                    style={[
                        styles.messageBubble,
                        isUser
                            ? [styles.userMessageBubble, { backgroundColor: theme.colors.primary }]
                            : [
                                styles.professionalMessageBubble,
                                {
                                    backgroundColor: theme.colors.background,
                                    borderColor: theme.colors.border,
                                },
                            ],
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            {
                                color: isUser ? "#FFFFFF" : theme.colors.text,
                            },
                        ]}
                    >
                        {msg.text}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text
                            style={[
                                styles.messageTime,
                                {
                                    color: isUser ? "rgba(255,255,255,0.8)" : theme.colors.textLighter,
                                },
                            ]}
                        >
                            {formatTime(msg.timestamp)}
                        </Text>
                        {isUser && (
                            <Text
                                style={[
                                    styles.messageStatus,
                                    {
                                        color: msg.status === "read" ? "#34D399" : "rgba(255,255,255,0.6)",
                                    },
                                ]}
                            >
                                {getStatusIcon(msg.status)}
                            </Text>
                        )}
                    </View>
                </View>
            </Animated.View>
        )
    }

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.backgroundLight,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.background,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        backButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        professionalHeaderAvatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            position: "relative",
        },
        professionalHeaderAvatarText: {
            fontSize: 16,
            fontWeight: "700",
            color: "#FFFFFF",
        },
        onlineIndicator: {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.colors.success,
            borderWidth: 2,
            borderColor: theme.colors.background,
        },
        professionalName: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.text,
        },
        professionalStatus: {
            fontSize: 12,
            color: theme.colors.textLight,
            fontWeight: "400",
        },
        headerAction: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.backgroundSoft,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
        },
        inputContainer: {
            backgroundColor: theme.colors.background,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        messageInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontSize: 15,
            maxHeight: 100,
            backgroundColor: theme.colors.backgroundLight,
            color: theme.colors.text,
            fontWeight: "400",
        },
        attachmentButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.backgroundSoft,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
        },
        voiceButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.backgroundSoft,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
        },
        sendButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
        },
        sendButtonActive: {
            backgroundColor: theme.colors.primary,
        },
        sendButtonInactive: {
            backgroundColor: theme.colors.border,
        },
    })
    const navigation = useNavigation()
    return (
        <SafeAreaView style={dynamicStyles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <Animated.View
                style={[
                    { flex: 1 },
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    {/* Header */}
                    <View style={dynamicStyles.header}>
                        <TouchableOpacity style={dynamicStyles.backButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        <View style={styles.professionalInfo}>
                            <View style={dynamicStyles.professionalHeaderAvatar}>
                                <Text style={dynamicStyles.professionalHeaderAvatarText}>SJ</Text>
                                {professional.isOnline && <View style={dynamicStyles.onlineIndicator} />}
                            </View>
                            <View style={styles.professionalDetails}>
                                <Text style={dynamicStyles.professionalName}>{professional.name}</Text>
                                <Text style={dynamicStyles.professionalStatus}>
                                    {professional.isOnline ? "Online • " + professional.profession : "Last seen 5 min ago"}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={dynamicStyles.headerAction}>
                                <Ionicons name="call" size={20} color={theme.colors.textLight} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 16 }}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg, index) => renderMessage(msg, index))}
                        {professional.isTyping && (
                            <View style={styles.typingIndicator}>
                                <View style={[styles.professionalAvatar, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={styles.professionalAvatarText}>SJ</Text>
                                </View>
                                <View
                                    style={[
                                        styles.typingBubble,
                                        {
                                            backgroundColor: theme.colors.background,
                                            borderColor: theme.colors.border,
                                        },
                                    ]}
                                >
                                    <View style={styles.typingDots}>
                                        <View style={[styles.typingDot, { backgroundColor: theme.colors.textLighter }]} />
                                        <View style={[styles.typingDot, { backgroundColor: theme.colors.textLighter }]} />
                                        <View style={[styles.typingDot, { backgroundColor: theme.colors.textLighter }]} />
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <View style={dynamicStyles.inputContainer}>
                        <View style={styles.inputRow}>
                            <TouchableOpacity
                                style={dynamicStyles.attachmentButton}
                                onPress={() =>
                                    Alert.alert("Attachments", "Choose attachment type", [
                                        { text: "📷 Camera", onPress: () => { } },
                                        { text: "🖼️ Gallery", onPress: () => { } },
                                        { text: "📍 Location", onPress: () => { } },
                                        { text: "📄 Document", onPress: () => { } },
                                        { text: "Cancel", style: "cancel" },
                                    ])
                                }
                            >
                                <Ionicons name="attach" size={20} color={theme.colors.textLight} />
                            </TouchableOpacity>
                            <TextInput
                                style={dynamicStyles.messageInput}
                                placeholder="Type your message..."
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                maxLength={1000}
                                placeholderTextColor={theme.colors.textLighter}
                            />
                            <TouchableOpacity
                                style={dynamicStyles.voiceButton}
                                onPress={() => Alert.alert("Voice Message", "Hold to record voice message")}
                            >
                                <Ionicons name="mic" size={20} color={theme.colors.textLight} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[dynamicStyles.sendButton, message.trim() ? dynamicStyles.sendButtonActive : dynamicStyles.sendButtonInactive]}
                                onPress={sendMessage}
                                disabled={!message.trim()}
                            >
                                <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
                                    <Ionicons
                                        name="paper-plane"
                                        size={20}
                                        color={message.trim() ? "#FFFFFF" : theme.colors.textLighter}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    professionalInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    professionalDetails: {
        flex: 1,
    },
    headerActions: {
        flexDirection: "row",
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    messageContainer: {
        flexDirection: "row",
        marginVertical: 6,
    },
    userMessageContainer: {
        justifyContent: "flex-end",
    },
    professionalMessageContainer: {
        justifyContent: "flex-start",
    },
    professionalAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        alignSelf: "flex-end",
    },
    professionalAvatarText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    messageBubble: {
        maxWidth: width * 0.75,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userMessageBubble: {
        borderBottomRightRadius: 4,
    },
    professionalMessageBubble: {
        borderBottomLeftRadius: 4,
        borderWidth: 1,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: "400",
    },
    messageFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 4,
    },
    messageTime: {
        fontSize: 11,
        marginRight: 4,
        fontWeight: "400",
    },
    messageStatus: {
        fontSize: 11,
        fontWeight: "500",
    },
    systemMessage: {
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: "center",
    },
    systemMessageText: {
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
    },
    systemMessageTime: {
        fontSize: 11,
        marginTop: 2,
        fontWeight: "400",
    },
    typingIndicator: {
        flexDirection: "row",
        marginVertical: 6,
    },
    typingBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    typingDots: {
        flexDirection: "row",
        alignItems: "center",
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 2,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
})

export default ChatScreen