import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ProfileCard from "../assets/ProfileCard";
import FeatureButton from "../assets/FeatureButton";
import CurrencyDisplay from "../assets/CurrencyContainer";
import OverlayWindow from "../assets/Overlay";
import EventsContent from "../assets/Events";
import AdContent from "../contents/AdContent";

import {
  AvatarIcon,
  EditRoomIcon,
  FriendlistIcon,
  HeartIcon,
  IkicoinIcon,
  MapsIcon,
  ShopIcon,
  TaskIcon,
} from "../../assets/images/homeIcons";

import DailyTask from "../contents/TaskContent/DailyTask";
import MyJournal from "../contents/TaskContent/MyJournalTask";
import PartnerJournal from "../contents/TaskContent/PartnerJournalTask";
import MainProfile from "../contents/ProfileContent/ProfileMainPage";
import PartnerProfile from "../contents/ProfileContent/PartnerProfileHelper";
import Settings from "../contents/ProfileContent/Settings";
import FriendList from "../contents/Friends/friendlist";
import FriendRequest from "../contents/Friends/friendrequest";
import ChatScreen from "../contents/Friends/chat";

// Use your scale hook here:
import { useScale } from "../../assets/usescale";

export default function Home() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const { scaleSize } = useScale();

  const [view, setView] = useState<"friendlist" | "chat">("friendlist");
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);

  // Overlay visibility state
  const [overlays, setOverlays] = useState<{
    overlayad: boolean;
    overlayevent: boolean;
    overlayfriend: boolean;
    overlaytask: boolean;
    overlayprofile: boolean;
  }>({
    overlayad: false,
    overlayevent: false,
    overlayfriend: false,
    overlaytask: false,
    overlayprofile: false,
  });

  const toggleOverlay = (name: keyof typeof overlays) => {
    setOverlays((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const closeOverlay = (name: keyof typeof overlays) => {
    setOverlays((prev) => ({ ...prev, [name]: false }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width,
      height,
      backgroundColor: "black",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingLeft: scaleSize(2),
      paddingTop: scaleSize(4),
    },
    profileCardContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: scaleSize(2),
      marginLeft: scaleSize(2),
    },
    bottomContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingHorizontal: scaleSize(4),
      marginTop: "auto",
      width: "100%",
      paddingRight: scaleSize(12),
    },
    bottomButtons: {
      flexDirection: "row",
      gap: scaleSize(5),
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.container}>
        {/* Profile Card */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            paddingHorizontal: scaleSize(10),
            marginTop: scaleSize(4),
          }}
        >
          <ProfileCard
            imageUri="https://www.w3schools.com/w3images/avatar2.png"
            username="John Doe"
            hashtag="#231"
            onPress={() => toggleOverlay("overlayprofile")}
          />
          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <CurrencyDisplay
              icon={<Image source={HeartIcon} style={{ width: scaleSize(15), height: scaleSize(15) }} />}
              currencyAmount={420}
              size={scaleSize(5)}
            />
            <CurrencyDisplay
              icon={<Image source={IkicoinIcon} style={{ width: scaleSize(15), height: scaleSize(15) }} />}
              currencyAmount={690}
              size={scaleSize(5)}
            />
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <View style={styles.bottomButtons}>
            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlayevent")}
                icon={<Ionicons name="megaphone-outline" size={scaleSize(20)} color="black" />}
                size={scaleSize(45)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlayfriend")}
                icon={<Image source={FriendlistIcon} style={{ width: scaleSize(30), height: scaleSize(25) }} />}
                size={scaleSize(45)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("../maps")}
                icon={<Image source={MapsIcon} style={{ width: scaleSize(30), height: scaleSize(25) }} />}
                size={scaleSize(45)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/ShopContent")}
                icon={<Image source={ShopIcon} style={{ width: scaleSize(30), height: scaleSize(25) }} />}
                size={scaleSize(45)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlayad")}
                icon={<Ionicons name="cart-outline" size={scaleSize(20)} color="black" />}
                size={scaleSize(45)}
              />
            </View>
          </View>

          <View style={styles.bottomButtons}>
            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/edit")}
                icon={<Image source={EditRoomIcon} style={{ width: scaleSize(40), height: scaleSize(35) }} />}
                size={scaleSize(65)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/Avatar")}
                icon={<Image source={AvatarIcon} style={{ width: scaleSize(45), height: scaleSize(35) }} />}
                size={scaleSize(65)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => toggleOverlay("overlaytask")}
                icon={<Image source={TaskIcon} style={{ width: scaleSize(40), height: scaleSize(35) }} />}
                size={scaleSize(65)}
              />
            </View>
          </View>
        </View>

        {/* Overlays */}
        {overlays.overlayad && (
          <OverlayWindow visible onClose={() => toggleOverlay("overlayad")} tabs={1} tab1={<AdContent />} />
        )}

        {overlays.overlayevent && (
          <OverlayWindow visible onClose={() => toggleOverlay("overlayevent")} tabs={1} tab1={<EventsContent />} />
        )}

        {overlays.overlaytask && (
          <OverlayWindow
            visible
            onClose={() => toggleOverlay("overlaytask")}
            tabs={3}
            tab1={<DailyTask />}
            tab1icon={AvatarIcon}
            tab1label="Daily Task"
            tab2={<MyJournal />}
            tab2icon={AvatarIcon}
            tab2label="My Task"
            tab3={<PartnerJournal />}
            tab3icon={AvatarIcon}
            tab3label="Partner Task"
          />
        )}

        {overlays.overlayfriend && (
          <OverlayWindow
            visible
            onClose={() => toggleOverlay("overlayfriend")}
            tabs={2}
            tab1={
              view === "friendlist" ? (
                <FriendList
                  onOpenChat={(userID: string) => {
                    setSelectedUserID(userID);
                    setView("chat");
                  }}
                />
              ) : (
                <ChatScreen onBack={() => setView("friendlist")} userID={selectedUserID ?? ""} />
              )
            }
            tab1icon={AvatarIcon}
            tab1label="Friendlist"
            tab2={<FriendRequest userID="321" />}
            tab2icon={AvatarIcon}
            tab2label="Friend Requests"
          />
        )}

        {overlays.overlayprofile && (
          <OverlayWindow
            visible
            onClose={() => toggleOverlay("overlayprofile")}
            tabs={3}
            tab1={<MainProfile userid={321}/>}
            tab1label="Profile"
            tab1icon={AvatarIcon}
            tab2={<PartnerProfile id ={321} />}
            tab2label="Partner Profile"
            tab2icon={AvatarIcon}
            tab3={<Settings />}
            tab3label="Settings"
            tab3icon={AvatarIcon}
          />
        )}
      </View>
    </View>
  );
}
