import React, { useState } from 'react';
import TaskCard from '../../assets/Tasks/MyJournalTaskCard';
import TaskDetail from '../../assets/Tasks/TaskDetail';
import { Ionicons } from "@expo/vector-icons";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Button,
    ImageSourcePropType,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Task structure
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Journal</Text>
      <View style={styles.content}>
        <View style={styles.leftColumn}>
          <View style={styles.taskListContainer}>
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
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.rightColumn}>
          {isAddingTask ? (
            <View>
              <Text style={styles.detailTitle}>Add New Task</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={newTask.title}
                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={newTask.description}
                multiline
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              />
              <Picker
                selectedValue={newTask.difficulty}
                onValueChange={(itemValue) =>
                  setNewTask({ ...newTask, difficulty: itemValue })
                }
              >
                <Picker.Item label="Easy" value="Easy" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Hard" value="Hard" />
              </Picker>
              <Button title="Add Image (not implemented)" onPress={() => {}} />
              <View style={styles.buttonRow}>
                <Button title="Cancel" onPress={() => setIsAddingTask(false)} />
                <Button title="Add" onPress={() => console.log('Task added:', newTask)} />
              </View>
            </View>
          ) : (
            selectedTask && (
              <TaskDetail
                selectedTask={selectedTask}
                isSubmitting={isSubmitting}
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
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 8,
    backgroundColor: "white",
  },
  taskListContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  taskList: {
    paddingBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addTaskWrapper: {
    alignItems: 'flex-start',
    padding: 12,
  },
  addTaskButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default PartnerJournal;
