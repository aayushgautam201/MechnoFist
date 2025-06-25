import type React from "react"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { View, StyleSheet, Dimensions, Animated } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

const colors = {
  background: "#FFFFFF",
  border: "#E5E7EB",
  textLighter: "#9CA3AF",
}

interface BottomSheetProps {
  children: React.ReactNode
  snapPoints: number[]
  index?: number
}

export interface BottomSheetRef {
  snapToIndex: (index: number) => void
  close: () => void
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(({ children, snapPoints, index = 0 }, ref) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT * (1 - snapPoints[index]))).current
  const currentIndex = useRef(index)

  useImperativeHandle(ref, () => ({
    snapToIndex: (snapIndex: number) => {
      const toValue = SCREEN_HEIGHT * (1 - snapPoints[snapIndex])
      currentIndex.current = snapIndex
      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start()
    },
    close: () => {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start()
    },
  }))

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newValue = SCREEN_HEIGHT * (1 - snapPoints[currentIndex.current]) + event.translationY
      if (newValue >= 0 && newValue <= SCREEN_HEIGHT) {
        translateY.setValue(newValue)
      }
    })
    .onEnd((event) => {
      const currentPosition = SCREEN_HEIGHT * (1 - snapPoints[currentIndex.current]) + event.translationY
      const velocity = event.velocityY

      // Find the closest snap point
      let closestIndex = 0
      let closestDistance = Math.abs(currentPosition - SCREEN_HEIGHT * (1 - snapPoints[0]))

      snapPoints.forEach((point, index) => {
        const distance = Math.abs(currentPosition - SCREEN_HEIGHT * (1 - point))
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      // Consider velocity for snapping
      if (velocity > 500 && closestIndex < snapPoints.length - 1) {
        closestIndex += 1
      } else if (velocity < -500 && closestIndex > 0) {
        closestIndex -= 1
      }

      const toValue = SCREEN_HEIGHT * (1 - snapPoints[closestIndex])
      currentIndex.current = closestIndex

      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start()
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </GestureDetector>
  )
})

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.textLighter,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
})

export default BottomSheet
