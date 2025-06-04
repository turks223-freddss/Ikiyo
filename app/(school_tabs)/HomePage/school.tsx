import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProfileCard from "../../assets/ProfileCard";
import FeatureButton from "../../assets/FeatureButton";
import CurrencyDisplay from "../../assets/CurrencyContainer";
import OverlayWindow from "../../assets/Overlay";
import EventsContent from "../../assets/Events"  
import AdContent from "../../contents/AdContent"; 
import MapsContent from "../../contents/MapsContent"; 
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon  } from "../../../assets/images/homeIcons";
import { DailyTaskIcon, EditTaskIcon, PartnerTaskIcon } from "../../../assets/images/TaskIcons";
import { ProfileIcon, SettingsIcon, PartnerProfileIcon } from "../../../assets/images/ProfileIcons";
import { FriendListIcon, FriendRequestIcon } from "../../../assets/images/friendlistIcons";
import DailyTask from "../../contents/TaskContent/DailyTask";
import MyJournal from "../../contents/TaskContent/MyJournalTask/MyJournalTask";
import PartnerJournal from "../../contents/TaskContent/PartnerJournalTask";
import MainProfile from "../../contents/ProfileContent/ProfileMainPage";
import PartnerProfile from "../../contents/ProfileContent/PartnerProfileHelper";
import Settings from "../../contents/ProfileContent/Settings";
import FriendList from "../../contents/Friends/friendlist";
import FriendRequest from "../../contents/Friends/friendrequest";
import ChatScreen from "../../contents/Friends/chat";
import RoomMainPage from "../RoomMainPage";
import { normalize } from '../../../assets/normalize';
import styles from "./HomePage.styles";


export default function Home() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const [view, setView] = useState<'friendlist' | 'chat'>('friendlist');
  const [selectedMap, setSelectedMap] = useState<string | undefined>(undefined);
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);
  // Overlay state management
  const [overlays, setOverlays] = useState<{ [key: string]: boolean }>({
    overlayad: false,
    overlayevent: false,
    overlayfriend: false,
    overlaytask: false,
    overlayprofile: false,
    overlaymaps: false,
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

  return (
    <View style={styles.main}>
      <View style={styles.room} pointerEvents="none">
        <RoomMainPage/>
      </View>
      <View style={styles.container}>
        {/* Profile Card Container */}
        <View style={styles.profileCardContainer}>
          <ProfileCard
            imageUri="https://www.w3schools.com/w3images/avatar2.png"
            username="John Doe"
            hashtag="#231"
            onPress={() => toggleOverlay("overlayprofile")} 
          />

          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <CurrencyDisplay
              icon={<Image source={HeartIcon} style={styles.currencyIcon} />} 
              currencyAmount={420}
              size={normalize(5)}
            />
            <CurrencyDisplay
              icon={<Image source={IkicoinIcon} style={styles.currencyIcon} />} 
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
                /*onPress={() => router.push("../maps")} */
                onPress={() => toggleOverlay("overlaymaps")} 
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
                onPress={() => router.push("/RoomMainPage")}
                icon={<Image source={EditRoomIcon} style={{ width: normalize(15), height:normalize(14)}} />} 
                size={normalize(30)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/editProfile")}
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
          tab2={<DailyTask/>}
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
          tab1={<FriendRequest userID={321}/>}
          tab1icon={FriendListIcon}
          tab2={<FriendRequest userID={321}/>}
          tab2icon={FriendRequestIcon}
          >
          </OverlayWindow>
        )}
        
        {overlays.overlayprofile && (
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlayprofile")}
          tabs={3}
          tab1={<MainProfile userid = {321} />}
          tab1icon={ProfileIcon}
          tab2={<PartnerProfile id={321}/>}
          tab2icon={PartnerProfileIcon}
          tab3={<Settings/>}
          tab3icon={SettingsIcon}
          >
          </OverlayWindow>
        )}

        {overlays.overlaymaps && (
        <OverlayWindow
          visible={true}
          onClose={() => toggleOverlay("overlaymaps")}
          tabs={1}
          tab1={<MapsContent location="school" />}
          width={normalize(200)}    // optional custom width
          height={normalize(150)}   // optional custom height
        />
        )}

      </View>
    </View>
  );
}