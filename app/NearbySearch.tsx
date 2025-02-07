import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import axios from "axios";

// Define the Type for the driver locations
interface Driver {
  id: string; // assuming there is an 'id' for each driver
  lat: number;
  lon: number;
}

interface NearbySearchMapProps {
  selectedLocation: { lat: number; lng: number } | null; // The location to search nearby drivers
}

const NearbySearchMap: React.FC<NearbySearchMapProps> = ({
  selectedLocation,
}) => {
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]); // Stores all drivers fetched from the TomTom API
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]); // Stores the nearby drivers fetched from the TomTom API
  const tomtomKey = "7zmNwV5XQGs5II7Z7KxIp9K551ZlFAwV"; // Your TomTom API key
  const nearbySearchRadius = 1000; // Radius in meters (3km)
  const totalDrivers = 7; // Number of drivers to generate for demonstration purposes

  // Function to calculate distance between two coordinates (Haversine formula)
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // distance in meters
    return distance;
  };

  // Helper function to generate random driver positions with better scatter
  const getRandomDriverLocations = (
    centerLat: number,
    centerLon: number,
    radius: number,
    numDrivers: number
  ): Driver[] => {
    const drivers: Driver[] = [];
    for (let i = 0; i < numDrivers; i++) {
      // Generate a random angle and random distance within and slightly outside the radius
      const angle = Math.random() * 2 * Math.PI; // Random angle between 0 and 2π
      const distance = Math.random() * (radius + 1000); // Allow some drivers outside the radius (extra 1km)

      // Convert polar coordinates to latitude/longitude offsets
      const latOffset = (distance / 111300) * Math.sin(angle); // Approximate conversion from meters to degrees (1 degree = ~111.3 km)
      const lonOffset =
        (distance / (111300 * Math.cos(centerLat * (Math.PI / 180)))) *
        Math.cos(angle); // Longitude conversion

      // Generate a new random driver location
      const driverLat = centerLat + latOffset;
      const driverLon = centerLon + lonOffset;

      // Store the generated driver
      drivers.push({ id: `driver_${i}`, lat: driverLat, lon: driverLon });
    }

    return drivers;
  };

  // Fetch all drivers based on the selected location
  const getAllDrivers = (lat: number, lng: number) => {
    // Generate random driver positions inside and around the radius
    const drivers = getRandomDriverLocations(
      lat,
      lng,
      nearbySearchRadius + 1000,
      totalDrivers
    ); // Generate 50 drivers for demonstration

    // Set the all drivers in the state
    setAllDrivers(drivers);

    // Filter drivers that are inside the search radius
    const nearby = drivers.filter(
      (driver) =>
        getDistance(lat, lng, driver.lat, driver.lon) <= nearbySearchRadius
    );

    // Set the nearby drivers in the state
    setNearbyDrivers(nearby);

    // Log all drivers and nearby drivers to the console
    console.log("All drivers:", drivers);
    console.log("Nearby drivers:", nearby);
  };

  // Use effect to trigger fetching all drivers when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      getAllDrivers(lat, lng);
    }
  }, [selectedLocation]); // Only run this effect when the location changes

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: selectedLocation?.lat || 0,
          longitude: selectedLocation?.lng || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Display the selected location with a circle */}
        {selectedLocation && (
          <Circle
            center={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
            radius={nearbySearchRadius}
            strokeColor="rgba(0, 122, 255, 0.5)"
            fillColor="rgba(0, 122, 255, 0.1)"
          />
        )}

        {/* Display all drivers as markers */}
        {allDrivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.lat,
              longitude: driver.lon,
            }}
            title={`Driver ${driver.id}`}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default NearbySearchMap;
