import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Suggestions from "@/components/Suggestion"; // Import the Suggestions component
import axios from "axios";
import * as Location from "expo-location"; // Import Expo's Location API

const MapWithSearch: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsData, setSuggestionsData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [placeholder, setPlaceholder] = useState("Search location...");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [lastSearchText, setLastSearchText] = useState(""); // Track last search text

  const tomtomKey = "7zmNwV5XQGs5II7Z7KxIp9K551ZlFAwV"; // Your TomTom API key

  // Function to fetch location suggestions from TomTom API
  const handleSearchTextChange = (changedSearchText: string) => {
    if (!changedSearchText || changedSearchText.length < 3) {
      setSuggestionsData([]); // Optionally clear suggestions when input is invalid
      setShowSuggestions(false); // Hide suggestions if the input is invalid
      return;
    }

    setSearchText(changedSearchText);
  };

  // Throttle search text updates to only trigger the request when the user stops typing for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== lastSearchText) {
        setDebouncedSearchText(searchText);
        setLastSearchText(searchText); // Update last search text
      }
    }, 500); // 500 ms delay before updating the search text

    return () => clearTimeout(timer); // Clean up timer on re-render
  }, [searchText]);

  // Now use debouncedSearchText in your API call function
  useEffect(() => {
    if (!debouncedSearchText || debouncedSearchText.length < 3) return;

    const baseUrl = `https://api.tomtom.com/search/2/search/${debouncedSearchText}.json?key=${tomtomKey}`;

    axios
      .get(baseUrl)
      .then((response) => {
        const addresses = response.data.results.map((v: any) => {
          let parts = v.address.freeformAddress.split(",");
          return {
            p1: parts[0],
            p2: parts[1],
            p3: parts[2],
            address: v.address.freeformAddress,
            lat: v.position.lat,
            lon: v.position.lon,
          };
        });
        setSuggestionsData(addresses);
        setShowSuggestions(true); // Show suggestions
      })
      .catch((error) => {
        console.error("Error fetching location data", error);
      });
  }, [debouncedSearchText]);

  // Handle suggestion select and update the map center
  const handleSuggestionSelect = (item: any) => {
    setSelectedLocation({ lat: item.lat, lng: item.lon });
    setShowSuggestions(false); // Hide the suggestion list after selection
  };

  const handleMapPress = (e: any) => {
    const { coordinate } = e.nativeEvent;
    setSelectedLocation({
      lat: coordinate.latitude,
      lng: coordinate.longitude,
    });
  };

  // Animate to the selected location without zooming out
  useEffect(() => {
    if (selectedLocation) {
      // Make sure to animate to the selected region without changing zoom
      const map = mapViewRef.current;
      if (map) {
        map.animateToRegion(
          {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            latitudeDelta: 0.0922, // Maintain the current zoom level
            longitudeDelta: 0.0421, // Maintain the current zoom level
          },
          1000
        ); // 1000 ms animation duration
      }
    }
  }, [selectedLocation]);

  const mapViewRef = React.useRef<MapView | null>(null); // Ref to the MapView

  // Get the user's current location using Expo Location API
  useEffect(() => {
    const getLocation = async () => {
      // Ask for permission to access the location
      const { status } = await Location.requestForegroundPermissionsAsync(); // Request foreground permissions

      if (status === "granted") {
        // Get the current position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        console.log("Current Location:", latitude, longitude);
        setSelectedLocation({ lat: latitude, lng: longitude });
      } else {
        console.error("Permission to access location was denied");
      }
    };

    getLocation();
  }, []);
  console.log("check sec", selectedLocation);

  return (
    <View style={{ flex: 1 }}>
      <Suggestions
        placeholder={placeholder}
        showList={showSuggestions}
        suggestionListData={suggestionsData}
        onPressItem={handleSuggestionSelect}
        handleSearchTextChange={handleSearchTextChange}
      />
      <MapView
        ref={mapViewRef} // Attach the ref to the MapView
        style={styles.map}
        region={{
          latitude: selectedLocation?.lat || 0,
          longitude: selectedLocation?.lng || 0,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        onPress={handleMapPress} // Handle map press event
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
            }}
            title="Selected Location"
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

export default MapWithSearch;
