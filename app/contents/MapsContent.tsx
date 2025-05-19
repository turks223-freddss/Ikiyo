import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import MapCard from "../assets/mapcard";
import { FriendListIcon } from "../../assets/images/friendlistIcons";
import { normalize } from "../../assets/normalize";

const maps = [
  {
    key: "home",
    title: "Home",
    icon: FriendListIcon,
    image: FriendListIcon,
  },
  {
    key: "school",
    title: "School",
    icon: FriendListIcon,
    image: FriendListIcon,
  },
  {
    key: "comingSoon",
    title: "Coming Soon",
    icon: FriendListIcon,
    image: FriendListIcon,
  },
];

export default function MapsContent() {
  const [selectedMap, setSelectedMap] = useState<string>("home");

  return (
    <View style={{ flex: 1, padding: normalize(5) }}>
      {/* Fixed Title above the list */}
      <Text style={styles.title}>Ikiyo Town</Text>

      {/* Scrollable list of maps */}
      <FlatList
        data={maps}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <MapCard
            title={item.title}
            icon={item.icon}
            image={item.image}
            isLocked={item.key === "comingSoon"}
            isSelected={selectedMap === item.key}
            onPress={() => {
              if (item.key !== "comingSoon") {
                setSelectedMap(item.key);
                // Additional logic if needed
              } else {
                alert("Coming Soon!");
              }
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: normalize(10) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(8),
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});
