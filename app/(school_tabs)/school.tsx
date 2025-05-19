import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProfileCard from "../assets/ProfileCard";
import FeatureButton from "../assets/FeatureButton";
import CurrencyDisplay from "../assets/CurrencyContainer";
import OverlayWindow from "../assets/Overlay";
import EventsContent from "../assets/Events"  
import AdContent from "../contents/AdContent"; 
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon  } from "../../assets/images/homeIcons"
import { DailyTaskIcon, EditTaskIcon, PartnerTaskIcon } from "../../assets/images/TaskIcons"
import { SettingsIcon, PartnerProfileIcon } from "../../assets/images/ProfileIcons"
import DailyTask from "../contents/TaskContent/DailyTask";
import MyJournal from "../contents/TaskContent/MyJournalTask";
import PartnerJournal from "../contents/TaskContent/PartnerJournalTask";
import MainProfile from "../contents/ProfileContent/ProfileMainPage";
import PartnerProfile from "../contents/ProfileContent/PartnerProfileHelper";
import Settings from "../contents/ProfileContent/Settings";
import FriendList from "../contents/Friends/friendlist";
import FriendRequest from "../contents/Friends/friendrequest";
import ChatScreen from "../contents/Friends/chat";
import { normalize } from '../../assets/normalize';


export default function Home() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const [view, setView] = useState<'friendlist' | 'chat'>('friendlist');
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);
  // Overlay state management
  const [overlays, setOverlays] = useState<{ [key: string]: boolean }>({
    overlayad: false,
    overlayevent: false,
    overlayfriend: false,
    overlaytask: false,
    overlayprofile: false,
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
      paddingLeft: normalize(2),
      paddingTop: normalize(4),
    },
    profileCardContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: normalize(2),
      marginLeft: normalize(2),
    },
    bottomContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingHorizontal: normalize(4),
      marginTop: "auto",
      width: "100%",
      paddingRight: normalize(12),
    },
    bottomButtons: {
      flexDirection: "row",
      gap: normalize(5), // Works in React Native 0.71+
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center", 
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
          paddingHorizontal: normalize(10), 
          marginTop: normalize(4), 
        }}>
          <ProfileCard
            imageUri="https://www.w3schools.com/w3images/avatar2.png"
            username="John Doe"
            hashtag="#231"
            onPress={() => toggleOverlay("overlayprofile")} 
          />

          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <CurrencyDisplay
              icon={<Image source={HeartIcon} style={{ width: normalize(15), height:normalize(15)}} />} 
              currencyAmount={420}
              size={normalize(5)}
            />
            <CurrencyDisplay
              icon={<Image source={IkicoinIcon} style={{ width: normalize(15), height:normalize(15)}} />} 
              currencyAmount={690}
              size={normalize(5)}
            />
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <View style={styles.bottomButtons}>
            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlayevent")}
                icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
                size={normalize(20)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlayfriend")} 
                icon={<Image source={FriendlistIcon} style={{ width: normalize(12), height:normalize(10)}} />} 
                size={normalize(20)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("../maps")}
                icon={<Image source={MapsIcon} style={{ width: normalize(12), height:normalize(10)}} />} 
                size={normalize(20)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/ShopContent")}
                icon={<Image source={ShopIcon} style={{ width: normalize(12), height:normalize(10)}} />} 
                size={normalize(20)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/fakelogin")} // Trigger overlay toggle
                icon={<Ionicons name="cart-outline" size={normalize(10)} color="black" />}
                size={normalize(20)}
              />
            </View>
          </View>

          {/* Main Action Buttons */}
          <View style={styles.bottomButtons}>
            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/editProfile")}
                icon={<Image source={EditRoomIcon} style={{ width: normalize(15), height:normalize(14)}} />} 
                size={normalize(30)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/Avatar")}
                icon={<Image source={AvatarIcon} style={{ width: normalize(15), height:normalize(14)}} />} 
                size={normalize(30)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlaytask")} 
                icon={<Image source={TaskIcon} style={{ width: normalize(15), height:normalize(14)}} />} 
                size={normalize(30)}
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
          tab1icon={DailyTaskIcon}
          tab2={<MyJournal/>}
          tab2icon={EditTaskIcon}
          tab3={<PartnerJournal/>}
          tab3icon={PartnerTaskIcon}
          >
          </OverlayWindow>
        )}

        {overlays.overlayfriend && (
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlayfriend")}
          tabs={2}
          tab1={
            view === 'friendlist' 
              ? <FriendList onOpenChat={(userID: string) => {
                  setSelectedUserID(userID);
                  setView('chat');
                }} />
              : <ChatScreen 
                  onBack={() => setView('friendlist')} 
                  userID={selectedUserID ?? ""} 
                />
          }
          tab1icon={AvatarIcon}
          tab2={<FriendRequest userID="321"/>}
          tab2icon={AvatarIcon}
          >
          </OverlayWindow>
        )}

        {overlays.overlayprofile && (
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlayprofile")}
          tabs={3}
          tab1={<MainProfile userid = {321} />}
          tab1icon={AvatarIcon}
          tab2={<PartnerProfile id={321}/>}
          tab2icon={PartnerProfileIcon}
          tab3={<Settings/>}
          tab3icon={SettingsIcon}
          >
          </OverlayWindow>
        )}

      </View>
    </View>
  );
}