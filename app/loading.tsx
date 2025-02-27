import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ImageBackground, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/login"); // ✅ Redirects to login after 2 seconds
    }, 5000);
  }, []);

  return (
    <ImageBackground 
      source={require("../assets/images/flower-cherry-blossom 1.png")} // ✅ Your background image
      style={styles.background}
      resizeMode="cover" // ✅ Makes sure the image fills the screen
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // ✅ Optional: Adds a slight dark overlay
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
