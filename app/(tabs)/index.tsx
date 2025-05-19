import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProfileCard from "../assets/ProfileCard";
import FeatureButton from "../assets/FeatureButton";
import CurrencyDisplay from "../assets/CurrencyContainer";
import OverlayWindow from "../assets/Overlay";
import EventsContent from "../assets/Events"  
import AdContent from "../contents/AdContent"; 
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon } from "../../assets/images/homeIcons"
import DailyTask from "../contents/TaskContent/DailyTask";
import MyJournal from "../contents/TaskContent/MyJournalTask";
import PartnerJournal from "../contents/TaskContent/PartnerJournalTask"
import MainProfile from "../contents/ProfileContent/ProfileMainPage"
import PartnerProfile from "../contents/ProfileContent/PartnerProfileHelper"
import Settings from "../contents/ProfileContent/Settings"
import AsyncStorage from "@react-native-async-storage/async-storage";
import eventBus from "../assets/utils/eventBus"

interface UserData {
  userID: number;
  username: string;
  email: string;
  password: string;
  gold: number;
  ruby: number;
  description: string | null;
  buddy: number| null;
}

export default function Home() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const [user, setUser] = useState<{
        userID: number;
      } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            if (typeof parsedUser === "number") {
              setUser({ userID: parsedUser }); // Convert number to object
            } else {
              setUser(parsedUser);
            }
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      };
      // #jandkjasdakdj
      fetchUserData();
    }, []);
  
    useEffect(() => {
        if (!user || !user.userID) return; // Prevent empty request
        // console.log("Current user:", user); // Debugging step
        
    
        const fetchUserData = () => {
          fetch("http://192.168.1.5:8081/api/user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: user.userID }),
          })
            .then(async (response) => {
              const text = await response.text(); // Read raw response
              return JSON.parse(text);
            })
            .then((data) => {
              setUserData(data);
            })
            .catch((error) => console.error("Error fetching user data:", error));
        };
        // Initial fetch when user changes
        fetchUserData();

        // Listen for buddyUpdate event to refresh user data
        eventBus.on("buddyUpdate", fetchUserData);

        // Cleanup listener on unmount or when user changes
        return () => {
          eventBus.off("buddyUpdate", fetchUserData);
  };
        
    }, [user]); // Runs when `user` changes

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
            username={userData?.username}
            hashtag={`#${userData?.userID}`}
            onPress={() => toggleOverlay("overlayprofile")} 
          />

          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <CurrencyDisplay
              icon={<Image source={HeartIcon} style={{ width: 50, height:50}} />} 
              currencyAmount={userData?.ruby??0}
              size={50}
            />
            <CurrencyDisplay
              icon={<Image source={IkicoinIcon} style={{ width: 50, height:50}} />} 
              currencyAmount={userData?.gold??0}
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
                onPress={() => router.push("/tasks")}
                icon={<Image source={EditRoomIcon} style={{ width: 50, height:40}} />} 
                size={90}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/avatar")}
                icon={<Image source={AvatarIcon} style={{ width: 50, height:40}} />} 
                size={90}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlaytask")} 
                icon={<Image source={TaskIcon} style={{ width: 50, height:40}} />} 
                size={90}
              />
            </View>
          </View>
        </View>

        {/* Overlay Logic */}
        {overlays.overlayad && (
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlayad")} 
          tabs={1} 
          tab1={<AdContent/>}>
          </OverlayWindow>
        )}

        {overlays.overlayevent && (
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlayevent")}
          tabs={1}
          tab1={<EventsContent/>}
          >
          </OverlayWindow>
        )}

        {overlays.overlaytask && (
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlaytask")}
          tabs={3}
          tab1={<DailyTask/>}
          tab1icon={AvatarIcon}
          tab1label={"Daily Task"}
          tab2={<MyJournal/>}
          tab2icon={AvatarIcon}
          tab2label={"My Task"}
          tab3={<PartnerJournal/>}
          tab3icon={AvatarIcon}
          tab3label={"Partner Task"}
          >
          </OverlayWindow>
        )}

        {overlays.overlayprofile && (
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlayprofile")}
          tabs={3}
          tab1={<MainProfile userid={userData!.userID}
          username={userData?.username}
          hashtag= {`#${userData?.userID}`}
          description={userData?.description ?? ""}
          partner={userData?.buddy ?? undefined}
          >
          

          </MainProfile>}
          tab1icon={AvatarIcon}
          tab1label={"Profile"}
          tab2={<PartnerProfile id={userData!.userID}
          partner_id={userData?.buddy ?? undefined}/>}
          tab2icon={AvatarIcon}
          tab2label={"Partner Profile"}
          tab3={<Settings/>}
          tab3icon={AvatarIcon}
          tab3label={"Settings"}
          >
          </OverlayWindow>
        )}

      </View>
    </View>
  );
}