import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export function SuggestionListItem(props: any) {
  return (
    <TouchableOpacity onPress={() => props.onPressItem(props.item)}>
      <View style={styles.searchListItem}>
        <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
        <View>
          <Text style={styles.searchListItemTitle}>{props.item.p1}</Text>
          {props.item.p2 && props.item.p3 && (
            <Text>
              {props.item.p2}, {props.item.p3}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchListItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchListItemTitle: {
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
});
