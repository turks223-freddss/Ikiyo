import React, { useState, useEffect } from 'react';
import TaskCard from '../../assets/Tasks/MyJournalTaskCard';
import { Ionicons } from "@expo/vector-icons";
import AddTask from '../../assets/Tasks/AddTask';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Button,
    ImageSourcePropType,
    Alert,
    Dimensions,
    PixelRatio,
    useWindowDimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskDetailPT from '@/app/assets/Tasks/TaskDetailPT';
        
const { width, height } = Dimensions.get('window');

const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

type TaskData = {
    id: number;
    task_title: string;
    task_description: string;
    difficulty_level: string;
    reward: number;
    attachment?: string | null;
    icon?: string | null;
    created_at: string;
    updated_at: string;
    assigned_by: number;
    assigned_to: number;
};

const PartnerJournal: React.FC = () => {
const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [submissionText, setSubmissionText] = useState('');
    const [user, setUser] = useState<{ userID: number } | null>(null);
    const [taskList, setTaskList] = useState<TaskData[]>([]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState({
      task_title: '',
      task_description: '',
      difficulty_level: 'Easy',
      image: null as ImageSourcePropType | null,
    });
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 600;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    if (typeof parsedUser === "number") {
                        setUser({ userID: parsedUser });
                    } else {
                        setUser(parsedUser);
                    }
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user || !user.userID) return;

            try {
                const response = await fetch("http://192.168.1.5:8081/api/task-action/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "list_assigned_by",
                        userID: user.userID,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data && data.tasks_assigned_by_user) {
                    setTaskList(data.tasks_assigned_by_user);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                Alert.alert("Error", "Failed to load tasks. Please try again later.");
            }
        };

        fetchTasks();
    }, [user, reloadTrigger]);

    const handleAddTask = async () => {
      if (!user || !user.userID) {
        Alert.alert("Error", "User not found.");
        return;
      }

      if (!newTask.task_title || !newTask.task_description) {
        Alert.alert("Validation Error", "Please fill in the title and description.");
        return;
      }

      try {
        const response = await fetch("http://192.168.1.5:8081/api/task-action/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create",
            userID: user.userID,
            task_title: newTask.task_title,
            task_description: newTask.task_description,
            difficulty_level: newTask.difficulty_level,
            // Add more fields if your backend expects them (e.g., image, reward, etc.)
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          Alert.alert("Success", "Task added successfully!");
          setIsAddingTask(false);
          setNewTask({
            task_title: '',
            task_description: '',
            difficulty_level: 'Easy',
            image: null,
          });
           // ✅ refresh task list
          setReloadTrigger(prev => !prev);

          // ✅ optionally close the add form
          setIsAddingTask(false);
        } else {
          Alert.alert("Error", "Failed to add task.");
        }
        setNewTask({
            task_title: '',
            task_description: '',
            difficulty_level: 'Easy',
            image: null,
          });
        setReloadTrigger(prev => !prev);

          // ✅ optionally close the add form
        setIsAddingTask(false);
      } catch (error) {
        console.error("Error adding task:", error);
        Alert.alert("Error", "Failed to add task. Please try again later.");
      }
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Journal</Text>
       <View style={[styles.content, isSmallScreen && styles.contentColumn]}>
         <View style={[styles.leftColumn, isSmallScreen && styles.fullWidth]}>
            <FlatList
              data={taskList}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.taskList}
              renderItem={({ item }) => (
                <TaskCard
                  questImage={require('../../../assets/images/homeIcons/hearts.png')}
                  titleName={item.task_title}
                  rewardImage={require('../../../assets/images/homeIcons/hearts.png')}
                  reward={item.reward}
                  isSelf={0}
                  onPress={() => {
                    setSelectedTask(item);
                    setIsEditing(false);
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

            <View>
              <Text style={styles.detailTitle}>Add New Task</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={newTask.task_title}
                onChangeText={(text) => setNewTask({ ...newTask, task_title: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={newTask.task_description}
                multiline
                onChangeText={(text) => setNewTask({ ...newTask,task_description: text })}
              />
              <Picker
                selectedValue={newTask.difficulty_level}
                onValueChange={(itemValue) =>
                  setNewTask({ ...newTask, difficulty_level: itemValue })
                }
              >
                <Picker.Item label="Easy" value="Easy" />
                <Picker.Item label="Very Easy" value="Very Easy" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Hard" value="Hard" />
                <Picker.Item label="Very Hard" value="Very Hard" />
              </Picker>
              <Button title="Add Image (not implemented)" onPress={() => {}} />
              <View style={styles.buttonRow}>
                <Button title="Cancel" onPress={() => setIsAddingTask(false)} />
                <Button title="Add" onPress={() => { handleAddTask(); setIsAddingTask(false); }} />
              </View>
            </View>
          ) : (
            selectedTask && (
              <TaskDetailPT
                selectedTask={selectedTask}
                isEditing={isEditing}
                isSelf={0}
                submissionText={submissionText}
                userID={user!.userID}
                setIsEditing={setIsEditing}
                setSubmissionText={setSubmissionText}
                triggerReload={() => setReloadTrigger(prev => !prev)} // 👈 Pass this
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
