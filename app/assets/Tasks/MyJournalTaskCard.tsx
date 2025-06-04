import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
  PixelRatio,
  Alert,
} from 'react-native';
import RewardPopup from '../Modals/RewardModal/Reward'; // Import your reward modal

// Normalize function for responsive scaling
const { width } = Dimensions.get('window');
const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

type MyJournalTaskCardProps = {
  questImage: ImageSourcePropType;
  titleName: string;
  rewardImage: ImageSourcePropType;
  status: string;
  userID: number;
  task_id: number;
  reward?: number;
  isSelf: 0 | 1;
  onPress: () => void;
  onClaimed?: () => void; // ✅ Add this line
};

const MyJournalTaskCard: React.FC<MyJournalTaskCardProps> = ({
  questImage,
  titleName,
  rewardImage,
  status,
  userID,
  task_id,
  reward,
  isSelf,
  onPress,
  onClaimed
}) => {
  const [showReward, setShowReward] = useState(false);
  const [pendingClaim, setPendingClaim] = useState(false);

  const handleClaim = async () => {
    try {
      const response = await fetch("http://192.168.1.5:8081/api/task-action/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "claim",
          userID: userID,
          task_id: task_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to claim reward");
      }

      setShowReward(true); // Show reward popup
      // Do NOT call onClaimed here!
    } catch (error) {
      console.error("Claim Error:", error);
      Alert.alert("Error", "Something went wrong while claiming the reward.");
    }
  };

  const handleRewardClaim = () => {
    setShowReward(false);
    if (onClaimed) onClaimed(); // Only call onClaimed after user clicks CLAIM
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        <Image source={questImage} style={styles.icon} />

        <View style={styles.middleContainer}>
          <Text style={styles.cardTitle}>{titleName}</Text>
          <View style={styles.rewardRow}>
            <Image source={rewardImage} style={styles.rewardIcon} />
            <Text style={styles.reward}>{reward}</Text>
          </View>
        </View>

        {isSelf === 1 && status === "Complete" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.claimButton}
              onPress={handleClaim}
            >
              <Text style={styles.buttonText}>Claim</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      <RewardPopup
        visible={showReward}
        rewardAmount={reward || 0}
        onGet={handleRewardClaim}
        onClose={() => setShowReward(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: normalize(6),
    borderRadius: normalize(6),
    marginBottom: normalize(6),
    elevation: 1,
  },
  icon: {
    width: normalize(24),
    height: normalize(24),
    marginRight: normalize(6),
    borderRadius: normalize(4),
    resizeMode: 'contain',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: normalize(9),
    fontWeight: 'bold',
    marginBottom: normalize(2),
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    width: normalize(10),
    height: normalize(10),
    marginRight: normalize(2),
  },
  reward: {
    fontSize: normalize(8),
    color: '#666',
  },
  buttonContainer: {
    marginLeft: normalize(4),
    width: normalize(35),
    height: normalize(24),
  },
  claimButton: {
    backgroundColor: '#4CAF50',
    borderRadius: normalize(4),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(4),
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(8),
    fontWeight: '600',
  },
});

export default MyJournalTaskCard;
