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
    borderRadius: normalize(6),
    padding: normalize(6),
    marginVertical: normalize(3),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questImage: {
    width: normalize(24),
    height: normalize(24),
    marginRight: normalize(6),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: normalize(9),
    fontWeight: '500',
    color: '#222',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(4),
  },
  rewardSection: {
    flexDirection: 'row', // makes label and box sit side-by-side
    alignItems: 'center',
    marginRight: normalize(4),
  },
  rewardText: {
    fontSize: normalize(8),
    color: '#444',
    marginRight: normalize(4), // space between text and box
  },
  rewardBox: {
    backgroundColor: '#222',
    borderRadius: normalize(4),
    padding: normalize(3),
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(28),
    height: normalize(28),
  },
  rewardImage: {
    width: normalize(12),
    height: normalize(12),
  },
  rewardAmount: {
    color: '#fff',
    fontSize: normalize(8),
    marginTop: normalize(1),
  },
  button: {
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(6),
    borderRadius: normalize(4),
    height: normalize(24),
    minWidth: normalize(50),
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
    fontSize: normalize(8),
    fontWeight: '600',
  },
});

export default DailyTask;
