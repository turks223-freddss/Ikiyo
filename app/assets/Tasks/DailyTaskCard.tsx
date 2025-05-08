import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ImageSourcePropType } from 'react-native';

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
      {/* Left: Quest Icon */}
      <Image source={questImage} style={styles.questImage} resizeMode="contain" />

      {/* Middle: Title (Vertically Centered) */}
      <View style={styles.content}>
        <Text style={styles.title}>{titleName}</Text>
      </View>

      {/* Right: Reward and Button Container */}
      <View style={styles.rightContainer}>
        {/* Reward Section */}
        <View style={styles.rewardSection}>
          <Text style={styles.rewardText}>Reward</Text>
          <View style={styles.rewardBox}>
            <Image source={rewardImage} style={styles.rewardImage} resizeMode="contain" />
            <Text style={styles.rewardAmount}>{reward}</Text>
          </View>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, completed ? styles.completed : styles.go]}
            onPress={handlePress}
            disabled={completed}
          >
            <Text style={styles.buttonText}>{completed ? 'Completed' : 'Go'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Vertically center the title
    alignItems: 'flex-start',  // Aligns the title to the left
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8, // Adds space between the title and the reward section
  },
  rightContainer: {
    flexDirection: 'row',  // Aligns reward section and button horizontally
    alignItems: 'center',  // Vertically centers the items
    justifyContent: 'flex-end', // Align to the right
  },
  rewardSection: {
    alignItems: 'center', // Centers the reward section horizontally
    marginRight: 12, // Adds space between the reward section and the button
  },
  rewardText: {
    fontSize: 12,
    color: '#444',
    marginBottom: 4,
  },
  rewardBox: {
    backgroundColor: '#222',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,  // Increased width to fit both icon and amount
    height: 60, // Increased height to match the size
  },
  rewardImage: {
    width: 30,  // Adjusted size for better fit
    height: 30, // Adjusted size for better fit
  },
  rewardAmount: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 40, // Fixed height for consistency
    justifyContent: 'center', // Center the button content
    alignItems: 'center', // Center the text horizontally
    minWidth: 90, // Set a minimum width to prevent shrinking too much
  },
  go: {
    backgroundColor: '#4CAF50',
  },
  completed: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    // Allow the button container to take space as needed, but won't break the layout
    minWidth: 150,
    justifyContent: 'center', // Aligns button vertically
    alignItems: 'center', // Centers button horizontally
  },
});

export default DailyTask;
