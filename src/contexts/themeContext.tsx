import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Appearance, type ColorSchemeName } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Theme {
  mode: "light" | "dark" | "system"
  colors: {
    primary: string
    primaryLight: string
    primarySoft: string
    secondary: string
    text: string
    textLight: string
    textLighter: string
    background: string
    backgroundLight: string
    backgroundSoft: string
    border: string
    success: string
    warning: string
    error: string
    blue: string
  }
}

const lightTheme: Theme = {
  mode: "light",
  colors: {
    primary: "#10B981",
    primaryLight: "#34D399",
    primarySoft: "#D1FAE5",
    secondary: "#8B5CF6",
    text: "#1F2937",
    textLight: "#6B7280",
    textLighter: "#9CA3AF",
    background: "#FFFFFF",
    backgroundLight: "#F9FAFB",
    backgroundSoft: "#F3F4F6",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    blue: "#3B82F6",
  },
}

const darkTheme: Theme = {
  mode: "dark",
  colors: {
    primary: "#10B981",           // Your specified emerald green
    primaryLight: "#34D399",      // Lighter emerald for hover states
    primarySoft: "#064E3B",       // Very dark emerald for subtle backgrounds
    secondary: "#A78BFA",         // Soft purple that complements emerald
    text: "#FFFFFF",              // Pure white for maximum contrast
    textLight: "#F3F4F6",         // Off-white for secondary text
    textLighter: "#9CA3AF",       // Medium gray for tertiary text
    background: "#000000",        // True black for main background
    backgroundLight: "#0F0F0F",   // Very dark gray for cards/sections
    backgroundSoft: "#1A1A1A",    // Dark gray for elevated elements
    border: "#262626",            // Dark gray for borders and dividers
    success: "#10B981",           // Same as primary for consistency
    warning: "#F59E0B",           // Warm amber
    error: "#EF4444",             // Bright red for errors
    blue: "#3B82F6",              // Standard blue
  },
}

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setThemeMode: (mode: "light" | "dark" | "system") => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system")
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme())

  useEffect(() => {
    loadThemePreference()

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme)
    })

    return () => subscription?.remove()
  }, [])

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme_mode")
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeMode(savedTheme as "light" | "dark" | "system")
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error)
    }
  }

  const saveThemePreference = async (mode: "light" | "dark" | "system") => {
    try {
      await AsyncStorage.setItem("theme_mode", mode)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  const getEffectiveTheme = (): Theme => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme
    }
    return themeMode === "dark" ? darkTheme : lightTheme
  }

  const toggleTheme = () => {
    const newMode = themeMode === "light" ? "dark" : "light"
    setThemeMode(newMode)
    saveThemePreference(newMode)
  }

  const setThemeModeHandler = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode)
    saveThemePreference(mode)
  }

  const theme = getEffectiveTheme()
  const isDark = theme.mode === "dark" || (themeMode === "system" && systemColorScheme === "dark")

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setThemeMode: setThemeModeHandler,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}