import { View, Text, Button, StyleSheet, TextInput, Alert,ImageBackground,TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SignupSign, LoginWallpaper } from "../../assets/images/authentication";
import styles from "./SignUp.styles"; 

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.5:8081/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
      } else {
        Alert.alert("Signup Failed", data.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server");
    } finally {
      setLoading(false);
    }




  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginWallpaper}
        style = {styles.backgroundImage}
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
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#5a3e2b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#5a3e2b"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.push("/login")}
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
    </View>
  );
}
