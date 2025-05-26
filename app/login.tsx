import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity, ImageBackground, } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sign, LoginWallpaper } from "../assets/images/authentication";
import { normalize } from "../assets/normalize";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.5:8081/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

       // Log the raw response to see the body
      const responseText = await response.text();
      console.log("Response Text:", responseText);

      const data = JSON.parse(responseText); // Now parse the response text


      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user)); // Save user data
        Alert.alert("Success", "Login successful");
        router.replace("/"); // Navigate to home
      } else {
        Alert.alert("Error", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error(error); // Log the error message
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={LoginWallpaper} style={styles.backgroundImage} resizeMode="contain">
        <ImageBackground source={Sign} style={styles.signboard} resizeMode="contain">
          <View style={styles.arrange}>
              <Text style={styles.title}>Welcome to iKiyo</Text>

              <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#5a3e2b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              />

              <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#5a3e2b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              />

              <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.push("/signup")}
              >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
              </TouchableOpacity>
              </View>
          </View>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e7d5b7", // light parchment or wooden backdrop
    paddingHorizontal: 20,
  },
  signboard: {
    width: normalize(350),
    height: normalize(250),
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(2),
    color: "#4a2f1b", // deep brown like carved wood
    textAlign: "center",
    fontFamily: "serif",
  },
  input: {
    width: "65%",
    height: normalize(20),
    borderColor: "#7c5a3a", // mid-tone brown
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: normalize(4),
    backgroundColor: "#fff8f0", // soft cream for handwritten look
    color: "#3e2a1e",
    fontSize: normalize(8),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
  },
  button: {
    flex: 1,
    backgroundColor: "#a86e3b", // wood-toned button
    paddingVertical: normalize(4),
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: normalize(6),
    fontFamily: "serif",
  },
  secondaryButton: {
    backgroundColor: "#fff8f0",
    borderWidth: 1,
    borderColor: "#a86e3b",
  },
  secondaryButtonText: {
    color: "#a86e3b",
  },
  arrange: {
    width: '100%',
    alignItems: 'center',
    marginBottom: normalize(7),
  }
});
