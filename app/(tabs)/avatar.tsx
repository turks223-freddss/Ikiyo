import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AvatarSkiaDisplay from '../assets/avatar/avatarComponent';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Avatar = () => {
  const [user, setUser] = useState<{ userID: number } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (typeof parsedUser === "number") {
            setUser({ userID: parsedUser });
          } else {
            setUser(parsedUser);
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching avatar:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading avatar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AvatarSkiaDisplay userID={user.userID} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Avatar;
