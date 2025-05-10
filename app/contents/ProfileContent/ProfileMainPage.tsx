import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { HeartIcon } from "../../../assets/images/homeIcons";

interface ProfilePageProps {
  userid: number;
  username?: string;
  hashtag?: string;
  description?: string;
  dateJoined?: string;
  partner?: string;
  school?: string;
  hearts?: number;
  outfits?: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  username = "John Doe",
  hashtag = "#john_doe123",
  description = "A short description about the user goes here. This is a bio section.",
  dateJoined = "January 1, 2020",
  partner = "N/A",
  school = "Unknown School",
  hearts = 321,
  outfits = 123,
}) => {
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
            <Text style={styles.iconLabel}> {hearts}</Text>
          </View>
          <View style={styles.iconText}>
            <Image source={HeartIcon} style={styles.iconImage} />
            <Text style={styles.iconLabel}> {outfits}</Text>
          </View>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.hashtag}>{hashtag}</Text>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        <View style={styles.additionalTexts}>
          <Text style={styles.infoLabel}>Date joined: {dateJoined}</Text>
          <Text style={styles.infoLabel}>Partner: {partner}</Text>
          <Text style={styles.infoLabel}>School: {school}</Text>
        </View>

        {/* Flex-spacer container to push button to bottom */}
        <View style={styles.editButtonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => {}}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
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
    width: 36,
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
    marginBottom: 16,
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
    gap: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
  editButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    paddingTop: 10,
  },
  editButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfilePage;
