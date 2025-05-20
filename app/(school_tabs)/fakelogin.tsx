import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { LoginWallpaper, Sign } from "../../assets/images/authentication"; // ✅ Include your background
import { normalize } from "../../assets/normalize";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.push("/fakesignup")}
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
  },
  signboard: {
    width: normalize(350),
    marginLeft: normalize(10),
    height: normalize(250),
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(2),
    color: "#4a2f1b",
    textAlign: "center",
    fontFamily: "serif",
  },
  input: {
    width: "65%",
    height: normalize(20),
    borderColor: "#7c5a3a",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: normalize(4),
    backgroundColor: "#fff8f0",
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
  arrange: {
    width: "100%",
    alignItems: "center",
    marginBottom: normalize(7),
  },
});
