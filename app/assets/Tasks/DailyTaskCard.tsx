import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
  PixelRatio,
} from 'react-native';

const { width } = Dimensions.get('window');

const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

interface DailyTaskProps {
  questImage: ImageSourcePropType;
  titleName: string;
  rewardImage: ImageSourcePropType;
  reward?: number;
}

const DailyTask: React.FC<DailyTaskProps> = ({
  questImage,
  titleName,
  rewardImage,
  reward = 80,
}) => {
  const [completed, setCompleted] = useState(false);

  const handlePress = () => {
    setCompleted(true);
  };

  return (
    <View style={styles.card}>
      <Image source={questImage} style={styles.questImage} resizeMode="contain" />

      <View style={styles.content}>
        <Text style={styles.title}>{titleName}</Text>
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.rewardSection}>
          <Text style={styles.rewardText}>Reward:</Text>
          <View style={styles.rewardBox}>
            <Image source={rewardImage} style={styles.rewardImage} resizeMode="contain" />
            <Text style={styles.rewardAmount}>{reward}</Text>
          </View>
        </View>

        <Pressable
          style={[styles.button, completed ? styles.completed : styles.go]}
          onPress={handlePress}
          disabled={completed}
        >
          <Text style={styles.buttonText}>{completed ? 'Done' : 'Go'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: normalize(8),
    padding: normalize(10), // Slightly reduced padding
    marginVertical: normalize(6),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questImage: {
    width: normalize(28), // Slightly smaller image
    height: normalize(28),
    marginRight: normalize(8), // Reduced margin
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: normalize(11), // Slightly smaller text
    fontWeight: '500',
    color: '#222',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(6), // Slightly smaller gap
  },
  rewardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(6), // Reduced space between reward and button
  },
  rewardText: {
    fontSize: normalize(9), // Slightly smaller text
    color: '#444',
    marginRight: normalize(5),
  },
  rewardBox: {
    backgroundColor: '#222',
    borderRadius: normalize(5), // Slightly smaller radius
    padding: normalize(4),
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(35), // Slightly smaller size
    height: normalize(35),
  },
  rewardImage: {
    width: normalize(14), // Slightly smaller image inside the reward box
    height: normalize(14),
  },
  rewardAmount: {
    color: '#fff',
    fontSize: normalize(9), // Slightly smaller font size
    marginTop: normalize(2),
  },
  button: {
    paddingVertical: normalize(5), // Slightly smaller button
    paddingHorizontal: normalize(10),
    borderRadius: normalize(5),
    height: normalize(28), // Slightly smaller button height
    minWidth: normalize(55), // Slightly smaller button width
    justifyContent: 'center',
    alignItems: 'center',
  },
  go: {
    backgroundColor: '#4CAF50',
  },
  completed: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(9), // Slightly smaller text
    fontWeight: '600',
  },
});

export default DailyTask;
