import { View, Text, Button, StyleSheet, TextInput, Alert,ImageBackground,TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SignupSign, LoginWallpaper } from "../assets/images/authentication";
import { normalize } from "../assets/normalize";

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
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  backgroundImage: {
    flex:1,
    resizeMode: 'cover',
    width: width,
    zIndex: -1,
    height: height,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "8%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signboard: {
    width: normalize(250),
    height: normalize(400),
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: normalize(10),
    fontWeight: "bold",
    color: "#4a2f1b",
    textAlign: "center",
    fontFamily: "serif",
    marginBottom: normalize(1),
  },
  input: {
    width: "55%",
    height: normalize(15),
    borderColor: "#7c5a3a",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: normalize(4),
    backgroundColor: "#fff8f0",
    color: "#3e2a1e",
    fontSize: normalize(6),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
    marginTop: normalize(2),
  },
  button: {
    flex: 1,
    backgroundColor: "#a86e3b",
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
  arrange:{
    width: '100%',
    alignItems: 'center',
    marginBottom: normalize(28),
  }
});
