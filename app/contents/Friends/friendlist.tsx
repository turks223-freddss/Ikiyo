import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { normalize } from '../../../assets/normalize';

import {
  AvatarIcon,
  MapsIcon,
  HeartIcon,
} from '../../../assets/images/homeIcons';

type Friend = {
  id: string;
  name: string;
  hashtag: string;
  isOnline: boolean;
  avatarUrl?: string;
};

type FriendListProps = {
  onOpenChat: (userID: string) => void;  // callback to open chat view
};

const mockFriends: Friend[] = [
  { id: '1', name: 'Alice', hashtag: '#1234', isOnline: true },
  { id: '2', name: 'Bob', hashtag: '#5678', isOnline: false },
  { id: '3', name: 'Charlie', hashtag: '#9012', isOnline: true },
  { id: '4', name: 'Diana', hashtag: '#3456', isOnline: false },
  { id: '5', name: 'Eve', hashtag: '#7890', isOnline: true },
];

const FriendList = ({ onOpenChat }: FriendListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mockFriends.map((friend) => (
          <View key={friend.id} style={styles.card}>
            <View style={styles.infoContainer}>
              <Image
                source={friend.avatarUrl ? { uri: friend.avatarUrl } : AvatarIcon}
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{friend.name}</Text>
                <Text style={styles.hashtag}>{friend.hashtag}</Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: friend.isOnline ? 'green' : 'gray' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.status,
                      { color: friend.isOnline ? 'green' : 'gray' },
                    ]}
                  >
                    {friend.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onOpenChat(friend.id)}
              >
                <Image source={MapsIcon} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image source={HeartIcon} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: normalize(4),
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: normalize(7),
    fontWeight: 'bold',
    marginBottom: normalize(4),
    color: '#333',
  },
  scrollContent: {
    paddingBottom: normalize(10),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    padding: normalize(4),
    marginBottom: normalize(3),
    elevation: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: normalize(14),
    height: normalize(14),
    borderRadius: normalize(7),
    marginRight: normalize(4),
    backgroundColor: '#ccc',
  },
  textContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(2),
  },
  name: {
    fontSize: normalize(5),
    fontWeight: '600',
    color: '#000',
    marginRight: normalize(2),
  },
  hashtag: {
    fontSize: normalize(4),
    color: '#888',
    marginRight: normalize(2),
  },
  status: {
    fontSize: normalize(4),
    fontWeight: '600',
    marginTop: normalize(1),
    marginRight: normalize(2),
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: normalize(3),
  },
  icon: {
    width: normalize(8),
    height: normalize(8),
    tintColor: '#555',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: normalize(2.5),
    height: normalize(2.5),
    borderRadius: normalize(1.25),
    marginRight: normalize(1.5),
  },
});

export default FriendList;
