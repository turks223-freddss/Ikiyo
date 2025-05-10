import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeartIcon } from "../../../assets/images/homeIcons";

const ProfilePage: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Left Side */}
      <View style={styles.leftContainer}>
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/600x800' }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.iconRow}>
          <View style={styles.iconText}>
            <Image source={HeartIcon} style={styles.iconImage} />
            <Text style={styles.iconLabel}>321</Text>
          </View>
          <View style={styles.iconText}>
            <Image source={HeartIcon} style={styles.iconImage} />
            <Text style={styles.iconLabel}>321</Text>
          </View>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.hashtag}>#john_doe123</Text>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            A short description about the user goes here. This is a bio section.
          </Text>
        </View>

        <View style={styles.additionalTexts}>
          <Text style={styles.infoLabel}>Date joined:</Text>
          <Text style={styles.infoLabel}>Partner:</Text>
          <Text style={styles.infoLabel}>School:</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  leftContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'flex-start',
  },
  mainImageContainer: {
    flex: 0.8,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  iconRow: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    width: 36, // slightly bigger
    height: 36,
  },
  iconLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  rightContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginLeft: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4a90e2',
    marginBottom: 12,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  hashtag: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16, // spacing before description
  },
  descriptionBox: {
    height: '40%',
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
  },
  additionalTexts: {
    alignSelf: 'flex-start',
    width: '100%',
    gap: 10, // gap between each info row
  },
  infoLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
});

export default ProfilePage;
