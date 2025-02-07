import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import * as SplashScreen from "expo-splash-screen";
import App from "./CalculateRoute";
import LocationPicker from "./LocationPicker";
import NearbySearchMap from "./NearbySearch";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash screen once the layout is fully ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <App /> */}
      {/* <LocationPicker /> */}
      <NearbySearchMap selectedLocation={{ lat: 10.816717, lng: 106.627072 }} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
