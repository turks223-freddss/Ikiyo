import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      
      {/* Top Navigation Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Settings Icon - Top Left */}
        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={28} color="black" />
        </TouchableOpacity>

        {/* Likes, Coins & Profile - Top Right */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          {/* Likes Icon */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="heart-outline" size={28} color="red" />
            <Text style={{ marginLeft: 5, fontSize: 18 }}>100</Text>
          </View>

          {/* Coins Icon */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="cash-outline" size={28} color="gold" />
            <Text style={{ marginLeft: 5, fontSize: 18 }}>500</Text>
          </View>

          {/* Profile Button */}
          <TouchableOpacity 
            style={{
              backgroundColor: "#ccc",
              padding: 8,
              borderRadius: 50,
            }}
            onPress={() => router.push("/profile")} // Navigate to profile.tsx
          >
            <Ionicons name="person-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>

      </View>

      {/* Content Centered Below */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Welcome to Home</Text>
      </View>

      {/* Floating Settings Tab */}
      <Modal
        transparent={true}
        visible={settingsVisible}
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View 
            style={{
              backgroundColor: "white",
              width: 250,
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 25, marginBottom: 15 }}>Settings</Text>

            {/* Options */}
            
            <TouchableOpacity onPress={() => {
              setSettingsVisible(false);
              router.replace("/login"); // ✅ Replaces current screen with login screen
            }}>
              <Text style={{ fontSize: 16, color: "red" }}>Logout</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              onPress={() => setSettingsVisible(false)}
              style={{
                marginTop: 20,
                backgroundColor: "#ccc",
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}
