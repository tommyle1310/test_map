import React, { useRef } from "react";
import { StyleSheet, View, TextInput, FlatList, Text } from "react-native";
import { SuggestionListItem } from "./SuggestionListItem";

// Define the type for props
interface SuggestionsProps {
  placeholder: string;
  showList: boolean;
  suggestionListData: any[]; // You can create a more specific type for the items in the suggestion list
  onPressItem: (item: any) => void;
  handleSearchTextChange: (text: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = (props) => {
  // Define the type for the ref object to handle the TextInput reference
  const searchInputRef = useRef<TextInput>(null);

  const handleOnPressItem = (item: any) => {
    searchInputRef.current?.blur(); // Remove focus from the search input
    props.onPressItem(item); // Trigger the callback on item press
  };

  return (
    <View style={styles.suggestionListContainer}>
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
            <SuggestionListItem onPressItem={handleOnPressItem} item={item} />
          )}
        />
      )}
    </View>
  );
};

export default Suggestions;

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
