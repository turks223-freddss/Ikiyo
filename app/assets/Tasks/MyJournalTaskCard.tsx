import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
  PixelRatio,
} from 'react-native';

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
  status: string
  reward?: number;
  isSelf: 0 | 1;
  onPress: () => void;
};

const MyJournalTaskCard: React.FC<MyJournalTaskCardProps> = ({
  questImage,
  titleName,
  rewardImage,
  status,
  reward,
  isSelf,
  onPress,
}) => {
  return (
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
            onPress={() => console.log('Submit task:', titleName)}
          >
            <Text style={styles.buttonText}>Claim</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
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
