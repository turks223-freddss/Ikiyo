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
import { AvatarIcon, EditRoomIcon, FriendlistIcon, HeartIcon, IkicoinIcon, MapsIcon, ShopIcon, TaskIcon  } from "../../assets/images/homeIcons"
import { DailyTaskIcon, EditTaskIcon, PartnerTaskIcon } from "../../assets/images/TaskIcons"
import { SettingsIcon, PartnerProfileIcon } from "../../assets/images/ProfileIcons"
import DailyTask from "../contents/TaskContent/DailyTask";
import MyJournal from "../contents/TaskContent/MyJournalTask/MyJournalTask";
import PartnerJournal from "../contents/TaskContent/PartnerJournalTask"
import MainProfile from "../contents/ProfileContent/ProfileMainPage"
import PartnerProfile from "../contents/ProfileContent/PartnerProfileHelper"
import Settings from "../contents/ProfileContent/Settings"
import AsyncStorage from "@react-native-async-storage/async-storage";
import eventBus from "../assets/utils/eventBus";
import FriendList from "../contents/Friends/friendlist";
import FriendRequest from "../contents/Friends/friendrequest"
import ChatScreen from "../contents/Friends/chat";
import { normalize } from '../../assets/normalize';
import RewardPopup from '../assets/Modals/RewardModal/Reward';
import ToastModal from "../assets/Modals/ToastModal/ToastModal";

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
  const [profileTab, setProfileTab] = useState(1);
  const router = useRouter();
  const { width, height } = Dimensions.get("window");
  const [user, setUser] = useState<{
        userID: number;
      } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [test,setTest] = useState("test");
  const [view, setView] = useState<'friendlist' | 'chat'>('friendlist');
    const [selectedUserID, setSelectedUserID] = useState<number | null>(null);
    // Overlay state management
    const [overlays, setOverlays] = useState<{ [key: string]: boolean }>({
      overlayad: false,
      overlayevent: false,
      overlayfriend: false,
      overlaytask: false,
      overlayprofile: false,
    });

  const openPartnerProfile = () => {
    setProfileTab(2); // Set to tab 2 (partner profile)
    setOverlays((prev) => ({
      ...prev,
      overlayprofile: true,
      overlaytask: false, // Optionally close the task overlay
    }));
  };

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
        console.log("hello entered")
        // Listen for buddyUpdate event to refresh user data
        eventBus.on("buddyUpdate", fetchUserData);
        eventBus.on("UserUpdate",fetchUserData);
        eventBus.on("refreshHome", refreshWholeScreen); // ⬅️ Add this line

        // Cleanup listener on unmount or when user changes
        return () => {
          eventBus.off("buddyUpdate", fetchUserData);
          eventBus.off("UserUpdate",fetchUserData);
          eventBus.off("refreshHome", refreshWholeScreen); // ⬅️ Add this line
  };
        
    }, [user]); // Runs when `user` changes


  // Function to toggle overlay visibility by name
  const toggleOverlay = (name: string) => {
    setOverlays((prevOverlays) => ({
      ...prevOverlays,
      [name]: !prevOverlays[name],
    }));
  };
  const [rewardVisible, setRewardVisible] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(30); // or any amount you want
  
  const handleShowReward = () => {
    setRewardAmount(30); // set the reward amount as needed
    setRewardVisible(true);
  };
  // Function to close the overlay
  const closeOverlay = (name: string) => {
    setOverlays((prevOverlays) => ({
      ...prevOverlays,
      [name]: false,
    }));
  };
  const refreshWholeScreen = () => {
    setTest("newtest")
    setRefreshKey(prev => prev + 1);
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
      paddingBottom: 30,
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

  console.log("Inside render, test =", test);
  console.log("buddy:",userData?.buddy)
  console.log("username:",userData?.username)
  console.log("description:",userData?.description)

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View key={refreshKey} style={styles.container}>
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
            username={userData?.username}
            hashtag={`#${userData?.userID}`}
            onPress={() => {
              setProfileTab(1);
              setOverlays((prev) => ({
                ...prev,
                overlayprofile: true,
              }));
            }}
          />

          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <CurrencyDisplay
              icon={<Image source={HeartIcon} style={{ width: normalize(15), height:normalize(15)}} />} 
              currencyAmount={userData?.ruby??0}
              size={normalize(5)}
            />
            <CurrencyDisplay
              icon={<Image source={IkicoinIcon} style={{ width: normalize(15), height:normalize(15)}} />} 
              currencyAmount={userData?.gold??0}
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
                onPress={handleShowReward} // Trigger overlay toggle
                icon={<Ionicons name="cart-outline" size={normalize(10)} color="black" />}
                size={normalize(20)}
              />
            </View>
          </View>

          {/* Main Action Buttons */}
          <View style={styles.bottomButtons}>
            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/tasks")}
                icon={<Image source={EditRoomIcon} style={{ width: normalize(15), height:normalize(14)}} />} 
                size={normalize(30)}
              />
            </View>

            <View style={styles.buttonRow}>
              <FeatureButton
                onPress={() => router.push("/avatar")}
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
        <ToastModal
          visible={rewardVisible}
          title="Claim Rewards"
          message="Action completed!"
          onConfirm={() => {
            // handle reward claim logic here
            setRewardVisible(false);
          }}
          onCancel={() => {
            // handle reward claim logic here
            setRewardVisible(false);
          }}
          confirmText="Yes"
          cancelText="No"
        />
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
        
          tab2={<MyJournal userData = {userData} openPartnerProfile={openPartnerProfile} />}
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
              ? <FriendList userID={user?.userID}
              onOpenChat={(userID: number, friendID: number) => {
                  console.log("Opening chat with userID:", userID, "friendID:", friendID);
                  setSelectedUserID(friendID);
                  setView('chat');
                }} />
              : <ChatScreen 
                  onBack={() => setView('friendlist')} 
                  userID={user?.userID ?? 0}
                  friendID={selectedUserID ?? 0} 
                />
          }
          tab1icon={AvatarIcon}
          tab2={<FriendRequest userID={user?.userID}/>}
          tab2icon={AvatarIcon}
          >
          </OverlayWindow>
        )}

        {overlays.overlayprofile && (
          
          <OverlayWindow 
          visible={true} 
          onClose={() => toggleOverlay("overlayprofile")}
          initialTab={profileTab}
          tabs={3}
          tab1={<MainProfile userid={userData!.userID}
          username={userData?.username}
          hashtag= {`#${userData?.userID}`}
          description={userData?.description ?? ""}
          partner={userData?.buddy ?? undefined}
          >
          

          </MainProfile>}
          tab1icon={AvatarIcon}
         
          tab2={<PartnerProfile id={userData!.userID}
          partner_id={userData?.buddy ?? undefined}/>}
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