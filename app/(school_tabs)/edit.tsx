import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AvatarSkiaDisplay from '../assets/avatar/avatarComponent';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Avvatar</Text>
      <AvatarSkiaDisplay />
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

export default ProfileScreen;