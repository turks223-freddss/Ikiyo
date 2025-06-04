import React, { useState } from "react";
import { FlatList, View, Text } from "react-native";
import MapCard from "../assets/mapcard";
import { FriendListIcon } from "../../assets/images/friendlistIcons";
import { StyleSheet } from "react-native";
import { normalize } from '../../assets/normalize';
import { router } from "expo-router"; // Add this import
import { HomeMap, ComingSoonMap, HomeIcon} from "@/assets/images/homeIcons";

interface MapsContentProps {
  location: string; 
}

const maps = [
  {
    key: "home",
    title: "Home",
    icon: HomeIcon,
    image: HomeMap,
  },
  {
    key: "school",
    title: "School",
    icon: HomeIcon,
    image: ComingSoonMap,
  },
  {
    key: "comingSoon",
    title: "Coming Soon",
    icon: FriendListIcon,
    image: ComingSoonMap,
  },
];

export default function MapsContent({ location }: MapsContentProps) {
  const [selectedMap, setSelectedMap] = useState<string>(location);

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
            isSelected={item.key === location}
            onPress={() => {
              if (item.key !== "comingSoon") {
                setSelectedMap(item.key);
                if (item.key === "home") {
                  router.push("/"); // Go to root
                } else if (item.key === "school") {
                  router.push("/(school_tabs)/HomePage/school"); // Go to school route
                }
                // Add more routes as needed
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