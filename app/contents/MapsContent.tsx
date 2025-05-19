import React, { useState } from "react";
import { FlatList, View, Text } from "react-native";
import MapCard from "../assets/mapcard";
import { FriendListIcon } from "../../assets/images/friendlistIcons";
import { StyleSheet } from "react-native";
import { normalize } from '../../assets/normalize';


interface MapsContentProps {
  location: string; // current location key, e.g., "home", "school"
}

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

export default function MapsContent({ location }: MapsContentProps) {
  const [selectedMap, setSelectedMap] = useState<string>(location); // default to current location

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>Ikiyo Town</Text>

      <FlatList
        data={maps}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <MapCard
            title={item.title}
            icon={item.icon}
            image={item.image}
            isLocked={item.key === "comingSoon"}
            isSelected={item.key === location} // highlight current location
            onPress={() => {
              if (item.key !== "comingSoon") {
                setSelectedMap(item.key);
                // Optional: trigger callback or navigation
              } else {
                alert("Coming Soon!");
              }
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(8),
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: normalize(4),
  },
});