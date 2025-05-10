import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageSourcePropType } from 'react-native';
import DailyTask from '../../assets/Tasks/DailyTaskCard';

type TaskData = {
  questImage: ImageSourcePropType;
  titleName: string;
  rewardImage: ImageSourcePropType;
  reward?: number;
};

const tasks: TaskData[] = [
  {
    questImage: require('../../../assets/images/homeIcons/avatar.png'),
    titleName: 'Defeat 5 Enemies',
    rewardImage: require('../../../assets/images/homeIcons/ikicoin.png'),
    reward: 100,
  },
  {
    questImage: require('../../../assets/images/homeIcons/avatar.png'),
    titleName: 'Block 10 Attacks',
    rewardImage: require('../../../assets/images/homeIcons/ikicoin.png'),
    reward: 150,
  },
  {
    questImage: require('../../../assets/images/homeIcons/avatar.png'),
    titleName: 'Explore a New Area',
    rewardImage: require('../../../assets/images/homeIcons/ikicoin.png'),
    reward: 200,
  },
];

const DailyTasksScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Daily Tasks</Text>

      {/* Scrollable task list */}
      <ScrollView contentContainerStyle={styles.taskList}>
        {tasks.map((task, index) => (
          <DailyTask
            key={index}
            questImage={task.questImage}
            titleName={task.titleName}
            rewardImage={task.rewardImage}
            reward={task.reward}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',   // Ensure full width
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4', // Light background color
    paddingBottom: 20, // Space at the bottom
    borderRadius: 12, // Rounded corners for the container
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',  // Center the title text
    color: '#333', // Dark color for title
    marginBottom: 20, // Space below the title
    textTransform: 'uppercase', // Optional: makes the title uppercase for emphasis
  },
  taskList: {
    width: '100%', // Ensure the ScrollView uses 100% width of the container
    paddingBottom: 20,
  },
});

export default DailyTasksScreen;
