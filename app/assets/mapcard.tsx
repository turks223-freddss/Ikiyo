import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import { normalize } from "../../assets/normalize";
import { Ionicons } from "@expo/vector-icons";

interface MapCardProps {
  title: string;
  icon: ImageSourcePropType;
  image: ImageSourcePropType;
  isLocked?: boolean;
  isSelected?: boolean;
  onPress: () => void;
}



export default function MapCard({ title, icon, image, isLocked = false, isSelected = false, onPress }: MapCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, isSelected && styles.selectedCard]}
      activeOpacity={0.7}
    >
      {/* Left side: Icon + title */}
      <View style={styles.leftContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right side: Image with optional lock overlay */}
      <View style={styles.rightContainer}>
        <Image source={image} style={styles.mapImage} resizeMode="cover" />
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={normalize(40)} style={styles.lockIcon} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: "row",
    backgroundColor: "#f8d7c4",
    borderRadius: 10,
    marginBottom: normalize(15),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedCard: {
    borderWidth: 4,
    borderColor: "#ff7043", // highlight color
    backgroundColor: "#ffe2d4",
    zIndex: 3,
  },
  leftContainer: {
    width: "30%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: normalize(30),
    height: normalize(30),
    marginBottom: normalize(6),
  },
  title: {
    fontSize: normalize(8),
    fontWeight: "600",
    textAlign: "center",
  },
  rightContainer: {
    width: "70%",
    backgroundColor: 'grey',
    borderRadius: normalize(2),
    height: normalize(60),
    overflow: "hidden",
    justifyContent: "center",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  lockIcon: {
    width: normalize(50),
    height: normalize(50),
    tintColor: "white",
  },
});
