import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, Animated, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import Slider from "@react-native-community/slider";

export default function Home() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarX = useRef(new Animated.Value(-250)).current; // Sidebar starts hidden (-250px left)

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    Animated.timing(sidebarX, {
      toValue: isSidebarOpen ? -250 : 0, // Move sidebar in or out
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [fakeVolume, setFakeVolume] = useState(50); // Default fake value

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      {/* Profile Container */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          left:"15%",
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
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>John school Doe</Text>
          <Text style={{ fontSize: 14, color: "gray" }}>ID: 123456</Text>
        </View>
      </View>

      
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
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>1234</Text>
        </View>

        {/* Second Row: Heart Icon + Number */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="heart-outline" size={40} color="red" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>5</Text>
        </View>
      </View>


      {/* Map Button - Top Left */}
      <TouchableOpacity
        onPress={() => router.push("/maps")}
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

      {/* Menu Button (Top Left) */}
      <TouchableOpacity
        onPress={toggleSidebar}
        style={{
          position: "absolute",
          top: "8%",
          left: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="menu" size={32} color="black" />
      </TouchableOpacity>



      {/* Sidebar (Drawer Menu) */}
<Animated.View
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: 250, // Sidebar width
    backgroundColor: "#333", // Sidebar background color
    padding: 20,
    transform: [{ translateX: sidebarX }], // Slide animation
    justifyContent: "space-between", // Align elements properly
  }}
>
  {/* Back Button */}
  <TouchableOpacity
    onPress={toggleSidebar} // Function to close sidebar
    style={{
      position: "absolute",
      top: 20,
      left: 20,
      padding: 10,
    }}
  >
    <Ionicons name="arrow-back" size={24} color="white" />
  </TouchableOpacity>

  {/* User Info Section */}
  <View style={{ marginTop: 60 }}> {/* Space below back button */}
    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
      John Doe hahahaha
    </Text>
    <Text style={{ color: "gray", fontSize: 14 }}>ID: 123456</Text>
  </View>

  {/* Logout Button at the Bottom */}
  <TouchableOpacity
    onPress={() => router.replace("/login")}
    style={{
      backgroundColor: "red",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    }}
  >
    <Text style={{ color: "white", fontSize: 16 }}>Logout</Text>
  </TouchableOpacity>
</Animated.View>

    </View>
  );
}