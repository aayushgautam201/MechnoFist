import React from "react";
import NavigationData from "./src/navigation/stackNavigation";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./src/contexts/themeContext";


const App: React.FC = () => {
  return (
    <ThemeProvider>
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <SafeAreaProvider>
        <NavigationData />
      </SafeAreaProvider>
    </GestureHandlerRootView>
    </ThemeProvider>
  );
}
export default App;