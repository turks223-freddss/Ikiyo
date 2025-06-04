import { Stack, useRouter } from "expo-router";
import React from "react";
import { useEffect } from "react";
import { MusicProvider } from "./assets/utils/musiccontext";

export default function RootLayout() {
  const router = useRouter();


  useEffect(() => {
    router.replace("/"); // ✅ Always start at the loading screen
  }, []);

  return (
    <>
    <MusicProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loading" options={{ headerShown: false }} />
      <Stack.Screen name="LogInPage/login" options={{ headerShown: false }} />
      <Stack.Screen name="SignUpPage/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(school_tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="community" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
    </MusicProvider>
    </>
  );
}