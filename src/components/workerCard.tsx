import type React from "react";
import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing } from "react-native";
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

interface WorkerCardProps {
  worker: Worker;
  onSelect: () => void;
  isSelected: boolean;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onSelect, isSelected }) => {
  const { theme } = useTheme();

  // Animation states
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  const detailsAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(detailsAnim, {
        toValue: 1,
        duration: 400,
        delay: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, detailsAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.99,
      speed: 30,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 30,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: worker.available ? 1 : 0.6,
          transform: [{ scale: scaleAnim }],
          backgroundColor: isSelected
            ? `rgba(${parseInt(theme.colors.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.primary.slice(5, 7), 16)}, 0.05)`
            : theme.colors.backgroundLight,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onSelect}
        activeOpacity={0.9}
        disabled={!worker.available}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.content}>
          <Image source={worker.image} style={styles.workerImage} />
          <View style={styles.info}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.header}>
                <Text style={[styles.name, { color: theme.colors.text }]}>{worker.name}</Text>
                {worker.verified && (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color={theme.colors.primary}
                    style={styles.verifiedIcon}
                  />
                )}
              </View>
              <Text style={[styles.category, { color: theme.colors.textLight }]}>{worker.category}</Text>
            </Animated.View>
            <Animated.View style={{ opacity: detailsAnim }}>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="star-outline" size={14} color={theme.colors.warning} />
                  <Text style={[styles.metaText, { color: theme.colors.textLight }]}>{worker.rating}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color={theme.colors.textLight} />
                  <Text style={[styles.metaText, { color: theme.colors.textLight }]}>{worker.distance} km</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size= {14} color={theme.colors.textLight} />
                  <Text style={[styles.metaText, { color: theme.colors.textLight }]}>{worker.estimatedArrival}</Text>
                </View>
              </View>
              <View style={styles.skillsContainer}>
                {worker.skills.slice(0, 3).map((skill, index) => (
                  <View
                    key={index}
                    style={[styles.skillTag, { backgroundColor: theme.colors.background }]}
                  >
                    <Text style={[styles.skillText, { color: theme.colors.textLight }]}>{skill}</Text>
                  </View>
                ))}
                {worker.skills.length > 3 && (
                  <Text style={[styles.moreSkills, { color: theme.colors.primary }]}>
                    +{worker.skills.length - 3}
                  </Text>
                )}
              </View>
            </Animated.View>
          </View>
          <View style={styles.rightSection}>
            <Text style={[styles.price, { color: theme.colors.text }]}>₹{worker.price}</Text>
            <Text style={[styles.priceUnit, { color: theme.colors.textLight }]}>/hr</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: worker.available ? theme.colors.success + "20" : theme.colors.error + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: worker.available ? theme.colors.success : theme.colors.error },
                ]}
              >
                {worker.available ? "Available" : "Busy"}
              </Text>
            </View>
          </View>
          <View style={[styles.statusDot, { backgroundColor: worker.available ? theme.colors.success : theme.colors.error }]} />
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  workerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 6,
  },
  verifiedIcon: {
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
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
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillTag: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 11,
    fontWeight: "400",
  },
  moreSkills: {
    fontSize: 11,
    fontWeight: "500",
    alignSelf: "center",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "400",
    marginBottom: 8,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  statusDot: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});

export default WorkerCard;