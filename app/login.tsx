import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      <Text style={styles.title}>Welcome to iKiyo</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonRow}>
        <Button title="Log In" onPress={handleLogin} />
        <View style={styles.space} />
        <Button title="Sign Up" onPress={() => router.push("/signup")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "35%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  space: {
    width: 25, // Horizontal spacing between buttons
  },
});
