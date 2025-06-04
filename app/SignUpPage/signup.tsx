import { View, Text, Button, StyleSheet, TextInput, Alert, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SignupSign, LoginWallpaper } from "../../assets/images/authentication";
import styles from "./SignUp.styles";
import ToastModal from "../assets/Modals/ToastModal/ToastModal";
import Ionicons from "@expo/vector-icons/build/Ionicons";

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastTitle, setToastTitle] = useState("Error");
  const [toastOnConfirm, setToastOnConfirm] = useState<() => void>(() => () => setToastVisible(false));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    setToastOnConfirm(() => () => setToastVisible(false));
    setToastTitle("Error");

    if (!username || !email || !password || !confirmPassword) {
      setToastMessage("Please fill in all fields.");
      setToastVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setToastMessage("Please enter a valid email address.");
        setToastVisible(true);
        return;
    }

    if (password !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://10.0.2.2:8000/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastTitle("Success");
        setToastMessage("Account created successfully!");
        setToastOnConfirm(() => () => {
          setToastVisible(false);
          router.push("/LogInPage/login");
        });
        setToastVisible(true);
      } else {
        setToastMessage(data.error || "Account creation failed. Email/Username may already exist.");
        setToastVisible(true);
      }
    } catch (error) {
      setToastMessage("Could not connect to the server");
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginWallpaper}
        style={styles.backgroundImage}
      >
        <View style={styles.centerContent}>
          <ImageBackground
            source={SignupSign}
            style={styles.signboard}
            resizeMode="contain"
          >
            <View style={styles.arrange}>
              <Text style={styles.title}>Create a New Account</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#5a3e2b"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#5a3e2b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.inputcontainer}>
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

              <View style={styles.inputcontainer}>
                <TextInput
                  style={styles.passwordinput}
                  placeholder="Confirm Password"
                  placeholderTextColor="#5a3e2b"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.sauron}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="#5a3e2b" />
                </TouchableOpacity>
              </View>

              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Signing..." : "Sign Up"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.push("/LogInPage/login")}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
      <ToastModal
        visible={toastVisible}
        message={toastMessage}
        onConfirm={toastOnConfirm}
        confirmText="OK"
        title={toastTitle}
      />
    </View>
  );
}
