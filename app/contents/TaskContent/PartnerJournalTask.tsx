import React, { useState } from 'react';
import TaskCard from '../../assets/Tasks/MyJournalTaskCard';
import TaskDetail from '../../assets/Tasks/TaskDetail';
import { Ionicons } from "@expo/vector-icons";
import AddTask from '../../assets/Tasks/AddTask';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageSourcePropType,
  Dimensions,
  PixelRatio,
  useWindowDimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

type TaskData = {
  questImage: ImageSourcePropType;
  titleName: string;
  rewardImage: ImageSourcePropType;
  reward?: number;
  description?: string;
  previewImage?: ImageSourcePropType;
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

const PartnerJournal: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    image: null as ImageSourcePropType | null,
  });

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
                isSelf={0}
                onPress={() => {
                  setSelectedTask(item);
                  setIsSubmitting(false);
                  setIsAddingTask(false);
                }}
              />
            )}
          />
          <View style={styles.addTaskWrapper}>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => {
                setSelectedTask(null);
                setIsAddingTask(true);
              }}
            >
              <Ionicons name="add" size={normalize(18)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.rightColumn, isSmallScreen && styles.fullWidth]}>
          {isAddingTask ? (
            <AddTask onClose={() => setIsAddingTask(false)}/>
          ) : (
            selectedTask && (
              <TaskDetail
                selectedTask={selectedTask}
                isSubmitting={isSubmitting}
                isSelf={0}
                submissionText={submissionText}
                setIsSubmitting={setIsSubmitting}
                setSubmissionText={setSubmissionText}
              />
            )
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: height * 0.03,
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    backgroundColor: '#f4f4f4',
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
    width: '40%',
    paddingRight: normalize(4),
  },
  rightColumn: {
    width: '60%',
    paddingLeft: normalize(4),
    backgroundColor: "white",
  },
  fullWidth: {
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  taskList: {
    paddingBottom: normalize(10),
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: normalize(6),
    padding: normalize(6),
    minHeight: normalize(12),
    marginBottom: normalize(6),
    fontSize: normalize(9),
  },
  titleDifficultyRow: {
    flexDirection: 'row',
    gap: normalize(6),
    marginBottom: normalize(6),
  },
  titleInput: {
    flex: 1,
  },
  descriptionInput: {
    minHeight: normalize(60),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: normalize(12),
    marginTop: normalize(6),
    marginBottom: normalize(20),
  },
  detailTitle: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    marginBottom: normalize(6),
  },
  addTaskWrapper: {
    alignItems: 'flex-start',
    padding: normalize(6),
  },
  addTaskButton: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addTaskFormWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  addTaskForm: {
    padding: normalize(6),
    flex: 1,
  },
  customButton: {
    backgroundColor: '#4CAF50',
    borderRadius: normalize(6),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(10),
    fontWeight: 'bold',
  },
  smallButton: {
    backgroundColor: '#4CAF50',
    width: '25%',
    borderRadius: normalize(6),
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginTop: normalize(6),
  },
  smallButtonText: {
    color: '#fff',
    fontSize: normalize(10),
    fontWeight: 'bold',
  },
});

export default PartnerJournal;
