import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, Animated, Pressable, Modal,TextInput,Alert} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

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
  const [user, setUser] = useState<{
    userID: number;
  } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [sliderValue1, setSliderValue1] = useState(50);
  const [sliderValue2, setSliderValue2] = useState(50);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Tab1"); // Tracks which tab is active

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
    

    fetch("http://192.168.1.5:8081/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID:user.userID }),
    })

    .then(async (response) => {
      const text = await response.text(); // Read raw response
      // console.log("Raw response:", text);
      return JSON.parse(text);
    })

    .then((data) => {
      // console.log("Fetched user data:", data);
      setUserData(data);
    })

      .catch((error) => console.error("Error fetching user data:", error));
    
  }, [user]); // Runs when `user` changes
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // Clear user data
    router.replace("/login"); // Redirect to login screen
  };

  useEffect(() => {
    if (userData?.username) {
      setNewUsername(userData.username);
    }
  }, [userData]);

  const handleUpdate = async () => {
  if (!newUsername.trim() || !user?.userID) {
    setIsEditing(false);
    return;
  }
  
  try {
    const response = await fetch(`http://192.168.1.5:8081/api/edit-user/${user.userID}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: newUsername }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", "Username updated successfully!");
      setUserData((prev) => prev ? { ...prev, username: newUsername } : prev); // Update UI
    } else {
      Alert.alert("Error", data.error || "Failed to update username.");
      setNewUsername(userData?.username || ""); // Revert to old username if update fails
    }
  } catch (error) {
    console.error("Error updating username:", error);
    Alert.alert("Error", "Something went wrong.");
    setNewUsername(userData?.username||"");
  }

  setIsEditing(false);
};

useEffect(() => {
  if (userData?.description) {
    setNewDescription(userData.description);
  }
}, [userData]);

const handleDescriptionUpdate = async () => {
  if (newDescription === userData?.description || !user?.userID) {
    setIsEditingDescription(false);
    return;
  }

  try {
    const response = await fetch(`http://192.168.1.5:8081/api/edit-user/${user.userID}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: newDescription }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", "Description updated successfully!");
    } else {
      Alert.alert("Error", data.error || "Failed to update description.");
      setNewDescription(userData?.description||""); // Revert to old description if update fails
    }
  } catch (error) {
    console.error("Error updating description:", error);
    Alert.alert("Error", "Something went wrong.");
    setNewDescription(userData?.description||"");
  }

  setIsEditingDescription(false);
};


  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const listPendingRequests = async (userID:number) => {
    try {
        const response = await fetch('http://192.168.1.5:8081/api/buddy/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                user_id: userID,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Pending requests:', data.pending_requests);
            // Set to state if using React:
            // setPendingRequests(data.pending_requests);
        } else {
            console.error('Error:', data.error || 'Failed to fetch');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const sendBuddyRequest = async (userID:number, targetID:number) => {
  try {
      const response = await fetch('http://192.168.1.5:8081/api/buddy/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              action: 'send_request',
              user_id: userID,
              target_id: targetID,
          }),
      });

      const data = await response.json();

      if (response.ok) {
          console.log(data.message);
      } else {
          console.error('Error:', data.error || 'Failed to send request');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

const acceptBuddyRequest = async (userID:number, fromUserID:number) => {
  try {
      const response = await fetch('http://192.168.1.5:8081/api/buddy/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              action: 'accept',
              user_id: userID,
              target_id: fromUserID,  // the one who sent the request
          }),
      });

      const data = await response.json();

      if (response.ok) {
          console.log(data.message);
      } else {
          console.error('Error:', data.error || 'Failed to accept request');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

const declineBuddyRequest = async (userID:number, fromUserID:number) => {
  try {
      const response = await fetch('http://192.168.1.5:8081/api/buddy/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              action: 'decline',
              user_id: userID,
              target_id: fromUserID,
          }),
      });

      const data = await response.json();

      if (response.ok) {
          console.log(data.message);
      } else {
          console.error('Error:', data.error || 'Failed to decline request');
      }
  } catch (error) {
      console.error('Error:', error);
  }
};


 


  return (

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      {/* Profile Container */}
      <Pressable
        onPress={toggleOverlay}
        style={{
          flexDirection: "row",
          alignItems: "center",
          left:"4%",
          backgroundColor: "#ddd",
          padding: 15,
          borderRadius: 50, // Rounded rectangle shape
          width: "30%",
          alignSelf: "center",
          position: "absolute",
          top: "5%", // Adjust position
        }}
      >
        {/* fix to add photo*/}
        <Ionicons 
          name="person-circle-outline" 
          size={60} 
          color="black" 
          style={{ marginRight: 15 }} 
        />

        {/* User Info */}
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>{userData?.username}</Text>
          <Text style={{ fontSize: 14, color: "gray" }}>{user ? user.userID : "Loading..."}</Text>
        </View>
      </Pressable>

      
      {/* New Container with Two Rows */}
      <View
        style={{
          backgroundColor: "transparent",
          padding: 15,
          borderRadius: 20,
          width: "15%",
          alignSelf: "center",
          position: "absolute",
          top: "5%", // Adjust position
          right:18,
          alignItems: "flex-start",
        }}
      >
        {/* First Row: Coin Icon + Amount */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Ionicons name="cash-outline" size={40} color="gold" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{userData?.gold}</Text>
        </View>

        {/* Second Row: Heart Icon + Number */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="heart-outline" size={40} color="red" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>5</Text>
        </View>
      </View>


      {/* Map Button - Top Left */}
      <TouchableOpacity
        onPress={() => router.push("../maps")}
        style={{
          position: "absolute",
          bottom: "20%",
          left: "13%",
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="map-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* edit avatar Button - Top Left */}
      <TouchableOpacity
        onPress={() => router.push("/profile")}
        style={{
          position: "absolute",
          bottom: "16%",
          right: "13%",
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="shirt-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* Edit Button - Bottom Right */}
      <TouchableOpacity
        onPress={() => router.push("/edit")}
        style={{
          position: "absolute",
          bottom: "7%",
          right: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="create-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* Tasks Button - Center */}
      <TouchableOpacity
        onPress={() => router.push("/tasks")}
        style={{
          position: "absolute",
          bottom: "30%",
          left: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="checkmark-done-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* Friends Button - Bottom Left */}
      <TouchableOpacity
        onPress={() => router.push("/friendlist")}
        style={{
          position: "absolute",
          bottom: "8%",
          left: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="people-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* Shop Button - Bottom Right */}
      <TouchableOpacity
        onPress={() => router.push("/shop")}
        style={{
          position: "absolute",
          bottom: "25%",
          right: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="cart-outline" size={32} color="black" />
      </TouchableOpacity>
      
      {/* OVERLAY MODAL WITH TABS */}
      <Modal
        visible={isOverlayVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleOverlay} // Close when pressing back
      >
        {/*background*/}
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
            justifyContent: "center",
            alignItems: "center",
          }}>
          {/* main overlay container*/}
          <View
            style={{
              width: "70%",
              height: "80%",
              backgroundColor: "white",
              borderRadius: 20,
              padding: 15,
              alignItems: "center",
            }}
          >
            {/* CLOSE BUTTON */}
            <TouchableOpacity
              onPress={toggleOverlay}
              style={{ 
                position:"absolute",
                right:"1%",
                top:"2%",
                zIndex:999
                }}
            >
              <Ionicons name="close-circle-outline" size={32} color="black" />
            </TouchableOpacity>

            {/* TAB CONTENT */}
            {activeTab === "Tab1" && (
            <View style={{ 
              flexDirection:"row",
              justifyContent: "center",
              alignItems: "center",

              width:"100%",
              height:"100%",
              }}>
              {/* avatar part */}
              <View style={{
                flexDirection:"column",
                padding:5,

                height:"100%",
                width:"45%",
                justifyContent: "center",
                alignItems:"center"
              }}>
                {/* Profile Icon */}
                <Ionicons name="person-circle-outline" size={200} color="black" />
                {/* inventory count and likes */}
                <View style={{
                  flexDirection:"row",
                  height:"25%",
                  width:"100%"
                }}>
                  {/* inventory count*/}
                  <View style={{
                    flex: 2,
                    flexDirection:"row",
                    justifyContent:"center",
                    alignItems:"center"

                  }}>
                    <Ionicons name="shirt" size={50} color="pink" />
                    <Text style={{fontSize:27,fontWeight:"bold"}}>36</Text>

                  
                  </View>
                  {/*likes */}
                  <View style={{
                    flex: 2,
                    flexDirection:"row",
                    justifyContent:"center",
                    alignItems:"center"

                  }}>
                    <Ionicons name="heart" size={50} color="red" />
                    <Text style={{fontSize:27,fontWeight:"bold"}}>36</Text>
                  </View>
                </View>
              </View>
              {/* profile description */}
              <View style={{
                flexDirection:"column",
                padding:5,
                height:"100%",
                width:"55%",
                justifyContent:"center",
                gap:10
              }}>
                {/* username*/}
                <View style={{
                  flexDirection:"row",
                  height:"30%",
                  width:"100%",
                  backgroundColor:"#FFCBA4",
                  borderRadius:30,

                }}>
                  <View style={{
                    height:"100%",
                    width:"35%",
                    justifyContent:"center",
                    alignItems:"center"
                    
                  }}>
                    
                  <Ionicons name="person-circle-outline" size={80} color="black" />
                  
                  </View>

                  <Pressable onPress={() => setIsEditing(true)}>
                  {isEditing ? (
                    <TextInput
                    value={newUsername}
                    onChangeText={setNewUsername}
                    autoFocus
                    onBlur={handleUpdate} // Call API on blur
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      borderBottomWidth: 1,
                      borderColor: "gray",
                      color:"grey"
                    }}
                  />
                  ) : (
                    <Text style={{ fontSize: 30, fontWeight: "bold" }}>{newUsername}</Text>
                  )}
                  <Text style={{ fontSize: 14, color: "gray" }}>{user ? user.userID : "Loading..."}</Text>
                  </Pressable>

                  
                </View>

                {/* user discription */}
                <Pressable
                  style={{
                    height: "40%",
                    width: "100%",
                    backgroundColor: "#FFDAB9",
                    borderRadius: 30,
                    padding: 10,
                    justifyContent: "flex-start",
                  }}
                  onPress={() => setIsEditingDescription(true)}
                >
                  {isEditingDescription ? (
                    <TextInput
                      value={newDescription}
                      onChangeText={setNewDescription}
                      autoFocus
                      onBlur={handleDescriptionUpdate} // Save when focus is lost
                      style={{
                        fontSize: 14,
                        color: "grey", // Change text color
                      }}
                    />
                  ) : (
                    <Text style={{ fontSize: 16, color: "black" }}>
                      {newDescription}
                    </Text>
                  )}
                </Pressable>



                <View style={{
                  flexDirection:"row",
                  height:"20%",
                  width:"100%",

                }}>

                  {/* school*/}
                  <View style={{
                    flex: 2,
                    flexDirection:"row",
                    justifyContent:"center",
                    alignItems:"center"

                  }}>
                    <Ionicons name="school" size={50} color="pink" />
                    <View>
                    <Text style={{fontSize:18,fontWeight:"bold"}}>school</Text>
                    <Text style={{fontSize:15,fontWeight:"bold"}}>school name</Text>
                    </View>

                  
                  </View>
                  {/*likes */}
                  <View style={{
                    flex: 2,
                    flexDirection:"row",
                    justifyContent:"center",
                    alignItems:"center"

                  }}>
                    <Ionicons name="person" size={50} color="black" />
                    <View>
                    <Text style={{fontSize:18,fontWeight:"bold"}}>Partner</Text>
                    <Text style={{fontSize:15,fontWeight:"bold"}}>Partner name</Text>
                    </View>
                  </View>
                  
                </View>

              </View>
            </View>

            )}
            {activeTab === "Tab2" && (
                (() => {
                    if (!userData?.buddy || userData.buddy === 0) {
                        // No buddy yet: trigger API & show fallback content
                        if (userData?.userID != null) {
                          listPendingRequests(userData.userID);
                      }

                        return (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
                                    No Buddy Yet!
                                </Text>
                                <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}>
                                    You don't have any buddy linked to your account yet. You can send a buddy request or wait for one.
                                </Text>
                            </View>
                        );
                    } else {
                        // Buddy exists: show buddy content
                        return (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
                                    Buddy Info
                                </Text>
                                <Text style={{ fontSize: 18, marginBottom: 20 }}>
                                    You're paired with: {userData.buddy}
                                </Text>
                                <Image
                                    
                                    style={{ width: 250, height: 250, resizeMode: "contain", borderRadius: 125 }}
                                />
                                {/* You can add more buddy details below */}
                                <Text style={{ fontSize: 16, marginTop: 15 }}>
                                    Contact: {userData.buddy}
                                </Text>
                            </View>
                        );
                    }
                })()
              )}
            {activeTab === "Tab3" && (
              <View style={{
                flexDirection:'column',
                gap:5,
                width:'100%'

              }}>
                <View style={{
                  flexDirection:'row',
                  alignItems:'center',
                  justifyContent:'center',
                  height:'15%',
                  width:'100%',
                  backgroundColor:'rgb(241, 167, 103)'
                }}>
                  <Text>
                    Settings</Text>
                </View>

                <View style={{
                  height:'45%',
                  width:'100%',
                  backgroundColor:'rgb(247, 118, 6)',
                  borderRadius:60,
                  flexDirection:'column'
                }}>

                </View>


                <View style={{
                  height:'35%',
                  width:'100%',
                  backgroundColor:'rgb(243, 229, 217)',
                  borderRadius:40,
                  alignItems:'center',
                  justifyContent:'center'
                  
                }}>
                  <TouchableOpacity style={{
                    backgroundColor:'rgb(244, 13, 13)',
                    width:'50%',
                    height:'50%',
                    alignItems:'center',
                    justifyContent:'center',
                    borderRadius:20
                  }}
                  onPress={handleLogout}>

                    <Text style={{
                      fontWeight:'bold',
                      fontSize:20,
                    }}>
                      LOGOUT
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>
            )}
          </View>
          {/*tab1*/}
          <Pressable
            onPress={() => setActiveTab("Tab1")}
            style={{
              position:"absolute",
              top:"15%",
              left:"7%",
              width: "8%",
              height: "15%",
              backgroundColor: "red",
              borderTopLeftRadius: 50, // Make the left side rounded
              borderBottomLeftRadius: 50, // Make the left side rounded
              borderTopRightRadius: 0, // Keep right side straight
              borderBottomRightRadius: 0, // Keep right side straight
              alignItems: "center",}}
          >


          </Pressable>
          {/*tab2*/}
          <Pressable
            onPress={() => setActiveTab("Tab2")}
            style={{
              position:"absolute",
              top:"31%",
              left:"7%",
              width: "8%",
              height: "15%",
              backgroundColor: "blue",
              borderTopLeftRadius: 50, // Make the left side rounded
              borderBottomLeftRadius: 50, // Make the left side rounded
              borderTopRightRadius: 0, // Keep right side straight
              borderBottomRightRadius: 0, // Keep right side straight
              alignItems: "center",}}
          >

          </Pressable>
           {/*tab3*/}
           <Pressable
            onPress={() => setActiveTab("Tab3")}
            style={{
              position:"absolute",
              top:"47%",
              left:"7%",
              width: "8%",
              height: "15%",
              backgroundColor: "green",
              borderTopLeftRadius: 50, // Make the left side rounded
              borderBottomLeftRadius: 50, // Make the left side rounded
              borderTopRightRadius: 0, // Keep right side straight
              borderBottomRightRadius: 0, // Keep right side straight
              alignItems: "center",}}
          >

          </Pressable>
        </View>
      </Modal>

    </View>
  );
}