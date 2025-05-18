import React, { useState } from 'react';
import TaskCard from '../../assets/Tasks/MyJournalTaskCard';
import TaskDetail from '../../assets/Tasks/TaskDetail';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

type TaskData = {
  questImage: any;
  titleName: string;
  rewardImage: any;
  reward?: number;
  description?: string;
  previewImage?: any;
};

const tasks: TaskData[] = [
  {
    questImage: require('../../../assets/images/homeIcons/avatar.png'),
    titleName: 'Defeat 5 Enemies',
    rewardImage: require('../../../assets/images/homeIcons/ikicoin.png'),
    reward: 100,
    description: 'Eliminate 5 enemies in the field to protect the village.',
    previewImage: require('../../../assets/images/homeIcons/ikicoin.png'),
  },
  {
    questImage: require('../../../assets/images/homeIcons/avatar.png'),
    titleName: 'Block 10 Attacks',
    rewardImage: require('../../../assets/images/homeIcons/ikicoin.png'),
    reward: 150,
    description: 'Use your shield to block 10 incoming attacks.',
  },
];

const MyJournal: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 600;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Journal</Text>

      <View style={[styles.content, isSmallScreen && styles.contentColumn]}>
        <View style={[styles.leftColumn, isSmallScreen && styles.fullWidth]}>
          <FlatList
            data={tasks}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.taskList}
            renderItem={({ item }) => (
              <TaskCard
                questImage={item.questImage}
                titleName={item.titleName}
                rewardImage={item.rewardImage}
                reward={item.reward}
                isSelf={1}
                onPress={() => {
                  setSelectedTask(item);
                  setIsSubmitting(false);
                }}
              />
            )}
          />
        </View>

        <View style={[styles.rightColumn, isSmallScreen && styles.fullWidth]}>
          {selectedTask && (
            <TaskDetail
              selectedTask={selectedTask}
              isSubmitting={isSubmitting}
              submissionText={submissionText}
              isSelf={1}
              setIsSubmitting={setIsSubmitting}
              setSubmissionText={setSubmissionText}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: height * 0.03,
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.03,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: height * 0.01,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: normalize(8),
  },
  contentColumn: {
    flexDirection: 'column',
  },
  leftColumn: {
    width: '40%',  // Adjust to 30% width
    paddingRight: normalize(4),
  },
  rightColumn: {
    width: '60%',  // Adjust to 70% width
    paddingLeft: normalize(4),
    backgroundColor: 'white',
  },
  fullWidth: {
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  taskList: {
    paddingBottom: normalize(10),
  },
});

export default MyJournal;
