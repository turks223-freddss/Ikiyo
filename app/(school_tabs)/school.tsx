import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProfileCard from "../assets/ProfileCard";
import FeatureButton from "../assets/FeatureButton";
import CurrencyDisplay from "../assets/CurrencyContainer";
import OverlayWindow from "../assets/Overlay";
import EventsContent from "../assets/Events"  
import AdContent from "../assets/AdContent"; 
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon } from "../../assets/images/homeIcons"

export default function Home() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  // Overlay state management
  const [overlays, setOverlays] = useState<{ [key: string]: boolean }>({
    overlayad: false,
    overlayevent: false,
  });

  // Function to toggle overlay visibility by name
  const toggleOverlay = (name: string) => {
    setOverlays((prevOverlays) => ({
      ...prevOverlays,
      [name]: !prevOverlays[name],
    }));
  };

  // Function to close the overlay
  const closeOverlay = (name: string) => {
    setOverlays((prevOverlays) => ({
      ...prevOverlays,
      [name]: false,
    }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: width,
      height: height,
      backgroundColor: "black",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingLeft: 20,
      paddingTop: 20,
    },
    profileCardContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginLeft: 10,
    },
    bottomContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingHorizontal: 20,
      paddingBottom: 30,
      marginTop: "auto",
      width: "100%",
      paddingRight: 18,
    },
    bottomButtons: {
      flexDirection: "row",
      gap: 10, // Works in React Native 0.71+
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 10, // Spacing between rows
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    overlayWindow: {
      width: "80%",
      height: "90%",
      backgroundColor: "rgba(255, 201, 172, 0.9)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      borderRadius: 10,
    },
    closeButton: {
      marginTop: 20,
      color: "blue",
      textDecorationLine: "underline",
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.container}>
        {/* Profile Card Container */}
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          width: "100%",
          paddingHorizontal: 20, 
          marginTop: 20 
        }}>
          <ProfileCard
            imageUri="https://www.w3schools.com/w3images/avatar2.png"
            username="John Doe"
            hashtag="#231"
          />

          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <CurrencyDisplay
              icon={<Image source={HeartIcon} style={{ width: 50, height:50}} />} 
              currencyAmount={420}
              size={50}
            />
            <CurrencyDisplay
              icon={<Image source={IkicoinIcon} style={{ width: 50, height:50}} />} 
              currencyAmount={690}
              size={50}
            />
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <View style={styles.bottomButtons}>
            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlayevent")}
                icon={<Ionicons name="megaphone-outline" size={25} color="black" />}
                size={60}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/friendlist")}
                icon={<Image source={FriendlistIcon} style={{ width: 35, height:30}} />} 
                size={60}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("../maps")}
                icon={<Image source={MapsIcon} style={{ width: 35, height:30}} />} 
                size={60}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/shop")}
                icon={<Image source={ShopIcon} style={{ width: 35, height:30}} />} 
                size={60}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlayad")} // Trigger overlay toggle
                icon={<Ionicons name="cart-outline" size={25} color="black" />}
                size={60}
              />
            </View>
          </View>

          {/* Main Action Buttons */}
          <View style={styles.bottomButtons}>
            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/edit")}
                icon={<Image source={EditRoomIcon} style={{ width: 50, height:40}} />} 
                size={90}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/tasks")}
                icon={<Image source={AvatarIcon} style={{ width: 50, height:40}} />} 
                size={90}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/tasks")}
                icon={<Image source={TaskIcon} style={{ width: 50, height:40}} />} 
                size={90}
              />
            </View>
          </View>
        </View>

        {/* Overlay Logic */}
        {overlays.overlayad && (
          <OverlayWindow visible={true} onClose={() => toggleOverlay("overlayad")}>
            <AdContent/>
          </OverlayWindow>
        )}

        {overlays.overlayevent && (
          <OverlayWindow visible={true} onClose={() => toggleOverlay("overlayevent")}>
            <EventsContent />
          </OverlayWindow>
        )}
      </View>
    </View>
  );
}