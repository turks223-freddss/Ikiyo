import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
  SafeAreaView,
  PixelRatio,
} from 'react-native';
import DailyTask from '../../assets/Tasks/DailyTaskCard';

const { width, height } = Dimensions.get('window');

// Adjusted normalize function (gentler scale)
const normalize = (size: number) => {
  const scale = width / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2; // subtract to tame large fonts
};


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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Tasks</Text>

        <View style={styles.taskList}>
          {tasks.map((task, index) => (
            <DailyTask
              key={index}
              questImage={task.questImage}
              titleName={task.titleName}
              rewardImage={task.rewardImage}
              reward={task.reward}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingTop: height * 0.03,
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.03,
    backgroundColor: '#f4f4f4',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: normalize(7),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: height * 0.02,
    textTransform: 'uppercase',
  },
  taskList: {
    flexGrow: 1,
    justifyContent: 'space-evenly', // space out tasks vertically
    gap: 10,
  },
});

export default DailyTasksScreen;
