import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SuggestionListItem } from "./SuggestionListItem";

interface SuggestionsProps {
  placeholder: string;
  showList: boolean;
  suggestionListData: any[];
  onPressItem: (item: any) => void;
  handleSearchTextChange: (text: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = (props) => {
  const searchInputRef = useRef<TextInput>(null);

  // Handle item press from suggestion list
  const handleOnPressItem = (item: any) => {
    searchInputRef.current?.blur(); // Remove focus from the search input
    props.onPressItem(item); // Trigger the callback on item press
  };

  // Close the suggestion list and dismiss keyboard when tapping outside
  const handleDismissSuggestions = () => {
    props.onPressItem(null); // Optionally you can pass null or any other callback to close the suggestions
    Keyboard.dismiss(); // Close the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissSuggestions}>
      <View style={styles.suggestionListContainer}>
        <View>
          {/* Wrap everything in a single <View> to avoid the error */}
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder={props.placeholder}
            onChangeText={props.handleSearchTextChange}
          />
          {props.showList && (
            <FlatList
              style={styles.searchList}
              data={props.suggestionListData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <SuggestionListItem
                  onPressItem={handleOnPressItem}
                  item={item}
                />
              )}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
  },
  suggestionListContainer: {
    width: "90%",
    marginLeft: "5%",
  },
  searchList: {
    marginTop: 10,
    backgroundColor: "#fff",
    maxHeight: 200, // Limit list height
  },
});

export default Suggestions;
