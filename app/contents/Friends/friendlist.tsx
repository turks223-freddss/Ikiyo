import React,{useState,useEffect} from 'react';
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
  // id: string;
  name: string;
  // hashtag: string;
  // isOnline: boolean;
  // avatarUrl?: string;
};

type FriendListProps = {
  userID?: number;
  onOpenChat: (userID: string) => void;  // callback to open chat view
};

// const mockFriends: Friend[] = [
//   { id: '1', name: 'Alice', hashtag: '#1234', isOnline: true },
//   { id: '2', name: 'Bob', hashtag: '#5678', isOnline: false },
//   { id: '3', name: 'Charlie', hashtag: '#9012', isOnline: true },
//   { id: '4', name: 'Diana', hashtag: '#3456', isOnline: false },
//   { id: '5', name: 'Eve', hashtag: '#7890', isOnline: true },
// ];

const FriendList = ({ userID,onOpenChat }: FriendListProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://192.168.1.5:8081/api/friend-action/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'view_friends',
            userID: userID,
          }),
        });

        const data = await response.json();

        const formattedFriends = data.friends.map((username: string, index: number) => ({
          name: username,
          hashtag: '#0000', // Placeholder unless backend includes this
          isOnline: false,  // Placeholder unless backend includes this
        }));

        setFriends(formattedFriends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {friends.map((friend,index) => (
          // <View key={friend.id} style={styles.card}>
          <View key={index} style={styles.card}>
            <View style={styles.infoContainer}>
              {/* <Image
                source={friend.avatarUrl ? { uri: friend.avatarUrl } : AvatarIcon}
                style={styles.avatar}
              /> */}
              <View style={styles.textContainer}>
                <Text style={styles.name}>{friend.name}</Text>
                {/* <Text style={styles.hashtag}>{friend.id}</Text> */}
                {/* <View style={styles.statusContainer}>
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
                </View> */}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onOpenChat("1")} //not yet for trial only
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
