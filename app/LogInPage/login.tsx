import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity, ImageBackground, Dimensions, } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sign, LoginWallpaper } from "../../assets/images/authentication";
import { normalize } from "../../assets/normalize";
import styles from "./Login.styles";
import ToastModal from "../assets/Modals/ToastModal/ToastModal"; // Adjust path if needed
import Ionicons from "@expo/vector-icons/build/Ionicons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.5:8081/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      const data = JSON.parse(responseText);

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/");
      } else {
        setToastMessage(data.error || "Invalid credentials");
        setToastVisible(true);
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Could not connect to server");
      setToastVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={LoginWallpaper} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.centerContent}>
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
              <View style= {styles.inputcontainer}>
                <TextInput
                  style={styles.passwordinput}
                  placeholder="Password"
                  placeholderTextColor="#5a3e2b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                style={styles.sauron}
                onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#5a3e2b" />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.push("/SignUpPage/signup")}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
      <ToastModal
        visible={toastVisible}
        message={toastMessage}
        onConfirm={() => setToastVisible(false)}
        confirmText="OK"
        title="Error"
      />
    </View>
  );
}
