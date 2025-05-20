import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SignupSign, LoginWallpaper} from "../../assets/images/authentication";
import { normalize } from "../../assets/normalize";

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={LoginWallpaper}
        style = {styles.backgroundImage}
        resizeMode="contain"
      >
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
            onPress={() => {}}
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
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e7d5b7", // parchment tone
  },
  signboard: {
    marginLeft: normalize(60),
    marginTop: normalize(20),
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
