import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

// Sample coordinates for start, middle (optional), and end locations
const route = [
  { latitude: 37.7749, longitude: -122.4194 }, // San Francisco (Start)
  { latitude: 36.7783, longitude: -119.4179 }, // Central California (Middle)
  { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles (End)
];

const App: React.FC = () => {
  const [driverLocation, setDriverLocation] = useState<any | null>(null); // Driver's location
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>(route); // Predefined route coordinates
  const [driverProgress, setDriverProgress] = useState<number>(0); // Progress along the route

  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(0); // Current waypoint index

  // Update the driver's position along the route at regular intervals
  useEffect(() => {
    const driverMovementInterval = setInterval(() => {
      if (currentWaypointIndex < routeCoordinates.length - 1) {
        // Get the next waypoint
        const startPoint = routeCoordinates[currentWaypointIndex];
        const endPoint = routeCoordinates[currentWaypointIndex + 1];

        // Move the driver smoothly from current waypoint to next waypoint
        const progress = driverProgress + 0.01; // Move 1% towards the next point

        // Calculate driver's position using linear interpolation (lerp)
        const currentLatitude = lerp(
          startPoint.latitude,
          endPoint.latitude,
          progress
        );
        const currentLongitude = lerp(
          startPoint.longitude,
          endPoint.longitude,
          progress
        );

        // Set the driver's new position
        setDriverLocation({
          lat: currentLatitude,
          lon: currentLongitude,
        });

        if (progress >= 1) {
          // If the driver reaches the next waypoint, move to the next segment
          setDriverProgress(0); // Reset progress for the next segment
          setCurrentWaypointIndex(currentWaypointIndex + 1); // Move to the next waypoint
        } else {
          setDriverProgress(progress); // Continue moving towards the next point
        }
      }
    }, 50); // Update position every 50ms

    return () => {
      clearInterval(driverMovementInterval); // Clean up interval on unmount
    };
  }, [driverProgress, currentWaypointIndex, routeCoordinates]);

  // Linear interpolation function
  const lerp = (start: number, end: number, progress: number) => {
    return start + (end - start) * progress;
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={{
          latitude: (route[0].latitude + route[route.length - 1].latitude) / 2,
          longitude:
            (route[0].longitude + route[route.length - 1].longitude) / 2,
          latitudeDelta: 0.1, // Higher values will zoom out and reduce the map's resolution
          longitudeDelta: 0.1, // Higher values will zoom out
        }}
        mapType="standard" // Lower-res map type
      >
        {/* Start Location Pin */}
        <Marker coordinate={route[0]} title="Start Location" pinColor="green" />

        {/* End Location Pin */}
        <Marker
          coordinate={route[route.length - 1]}
          title="End Location"
          pinColor="red"
        />

        {/* Draw the route using Polyline */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF0000"
          strokeWidth={4}
        />

        {/* Simulate Driver's real-time location */}
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.lat,
              longitude: driverLocation.lon,
            }}
            title="Driver's Location"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default App;
