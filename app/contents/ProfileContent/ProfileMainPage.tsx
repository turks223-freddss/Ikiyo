import React,{useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';
import { HeartIcon } from "../../../assets/images/homeIcons";
import AvatarSkiaDisplay from '../../assets/avatar/avatarComponent';
import eventBus from "../../assets/utils/eventBus"
import ToastModal from '../../assets/Modals/ToastModal/ToastModal';

interface ProfilePageProps {
  userid: number;
  username?: string;
  hashtag?: string;
  description?: string;
  dateJoined?: string;
  partner?: number;
  school?: string;
  hearts?: number;
  outfits?: number;
  variant?: 1 | 2;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  username,
  userid,
  hashtag,
  description,
  dateJoined = "January 1, 2020",
  partner,
  school = "Unknown School",
  hearts = 321,
  outfits = 123,
  variant = 1, 
}) => {
  const { width } = useWindowDimensions();
  const [showRemovePartnerToast, setShowRemovePartnerToast] = useState(false);

  const normalize = (size: number) => {
    const scale = width / 375;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  const dynamicStyles = getRightSideStyles(normalize, width);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username || '');
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSave = async () => {
  try {
    const response = await fetch(`http://192.168.1.5:8081/api/edit-user/${userid}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: editedUsername,
        description: editedDescription,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Failed to update user.');
      return;
    }

    // Optionally update displayed values
    setIsEditing(false);
    console.log('Update success:', data);
    eventBus.emit("UserUpdate");
    eventBus.emit("refreshHome");
  } catch (error) {
    console.error('Error updating user:', error);
    alert('An error occurred while updating.');
  }
};

const handleDelete = async () => {
  try {
    const response = await fetch(`http://192.168.1.5:8081/api/buddy/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action:"remove_buddy",
        user_id: partner,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Failed to remove buddy.');
      return;
    }

    // Optionally update displayed values
    setIsEditing(false);
    console.log('Update success:', data);
    eventBus.emit("UserUpdate");
    eventBus.emit("refreshHome");
  } catch (error) {
    console.error('Error removing buddy:', error);
    alert('An error occurred while updating.');
  }
};

useEffect(() => {
  setEditedUsername(username || '');
  setEditedDescription(description || '');
}, [username, description]);

  const [partnerUsername, setPartnerUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartnerUsername = async () => {
      if (partner) {
        try {
          console.log('Fetching partner username for userID:', partner);
          const response = await fetch('http://192.168.1.5:8081/api/user/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: partner }),
          });
          const data = await response.json();
          console.log('Partner fetch response:', data);
          setPartnerUsername(data.username);
        } catch (error) {
          console.error('Error fetching partner username:', error);
          setPartnerUsername(null);
        }
      } else {
        setPartnerUsername(null);
      }
    };
    fetchPartnerUsername();
  }, [partner]);

  return (
    <View key ={refreshKey} style={styles.container}>
      {/* Left Side */}
      <View style={styles.leftContainer}>
        <View style={styles.mainImageContainer}>
          <AvatarSkiaDisplay userID={userid} />
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
      <View style={dynamicStyles.rightContainer}>
        {/* Avatar and User Info */}
        
        <View style={dynamicStyles.avatarContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={dynamicStyles.avatar} />
          <View style={dynamicStyles.userDetails}>
            {isEditing ? (
              <TextInput
                style={[dynamicStyles.username, { borderBottomWidth: 1 }]}
                value={editedUsername}
                onChangeText={setEditedUsername}
              />
            ) : (
              <Text style={dynamicStyles.username}>{editedUsername}</Text>
            )}
            <Text style={dynamicStyles.hashtag}>{hashtag}</Text>
          </View>
          <View style={dynamicStyles.editButtonContainer}>
          <TouchableOpacity
            style={variant === 2 ? dynamicStyles.deleteButton : dynamicStyles.editButton}
            onPress={async () => {
              if (variant === 1) {
                if (isEditing) {
                    await handleSave();
                    refresh();
                  } else {
                    setIsEditing(true);
                  }
              } else {
                setShowRemovePartnerToast(true);
              }
            }}
          >
            <Text style={dynamicStyles.editButtonText}>
              {variant === 1 ? (isEditing ? 'Save' : 'Edit') : 'Remove'}
            </Text>
          </TouchableOpacity>
        </View>
        </View>

        {/* Description */}
        <View style={dynamicStyles.descriptionBox}>
          {isEditing ? (
            <TextInput
              style={dynamicStyles.descriptionText}
              value={editedDescription}
              onChangeText={setEditedDescription}
              multiline
            />
          ) : (
            <Text style={dynamicStyles.descriptionText}>{editedDescription}</Text>
          )}
        </View>

        {/* Additional Info */}
        <View style={dynamicStyles.additionalTexts}>
          <Text style={dynamicStyles.infoLabel}>Date joined: {dateJoined}</Text>
          <Text style={dynamicStyles.infoLabel}>
            Partner: {partner && partnerUsername ? `${partnerUsername}#${partner}` : 'None'}
          </Text>
          <Text style={dynamicStyles.infoLabel}>School: {school}</Text>
        </View>

        {/* Edit Button */}
        
      </View>
      <ToastModal
        visible={showRemovePartnerToast}
        title="Remove partner?"
        message="This action will remove all related partner information including tasks"
        confirmText="Remove"
        cancelText="Cancel"
        onCancel={() => setShowRemovePartnerToast(false)}
        onConfirm={async () => {
          setShowRemovePartnerToast(false);
          await handleDelete();
        }}
      />
    </View>
  );
};

const getRightSideStyles = (normalize: (size: number) => number, width: number) =>
  StyleSheet.create({
    rightContainer: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: normalize(5),
      marginLeft: width < 700 ? 0 : normalize(20),
      marginTop: width < 700 ? normalize(20) : 0,
      flexDirection: 'column',
      justifyContent: 'flex-start', // Ensure the content aligns at the top
    },
    avatarContainer: {
      flexDirection: 'row', // Align avatar and user details horizontally
      alignItems: 'center',
      marginBottom: normalize(5),
    },
    avatar: {
      width: normalize(20),
      height: normalize(20),
      borderRadius: normalize(25),
      borderWidth: 3,
      borderColor: '#4a90e2',
      marginRight: normalize(5),
    },
    userDetails: {
      flexDirection: 'column',
    },
    username: {
      fontSize: normalize(8),
      fontWeight: '700',
      color: '#222',
    },
    hashtag: {
      fontSize: normalize(6),
      color: '#777',
    },
    descriptionBox: {
      height: '30%',
      width: '100%',
      backgroundColor: '#f0f0f0',
      padding: normalize(6),
      borderRadius: normalize(8),
      justifyContent: 'center',
      marginBottom: normalize(6),
    },
    descriptionText: {
      fontSize: normalize(4),
      color: '#444',
      textAlign: 'center',
    },
    additionalTexts: {
      alignSelf: 'flex-start',
      width: '100%',
      gap: normalize(2),
    },
    infoLabel: {
      fontSize: normalize(5),
      color: '#333',
      fontWeight: '400',
    },
    editButtonContainer: {
      flexGrow: 1, // This will push the button upwards
      justifyContent: 'flex-start', // Ensure the button is at the top of the container
      alignItems: 'flex-end', // Align button to the right
    },
    editButton: {
      backgroundColor: '#4a90e2',
      paddingHorizontal: normalize(4),
      paddingVertical: normalize(2.5),
      borderRadius: normalize(6),
      marginTop: normalize(0), // Ensure some spacing at the top
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      paddingHorizontal: normalize(4),
      paddingVertical: normalize(2.5),
      borderRadius: normalize(6),
      marginTop: normalize(0),
    },
    editButtonText: {
      color: '#fff',
      fontSize: normalize(4),
      fontWeight: '600',
    },
  });

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
});

export default ProfilePage;
