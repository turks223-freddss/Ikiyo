import React, { useState, useEffect } from 'react';
import TaskCard from '../../assets/Tasks/MyJournalTaskCard';
import { Ionicons } from "@expo/vector-icons";
import AddTask from '../../assets/Tasks/AddTask';
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../../assets/Tasks/CloudinaryUpload"
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
    Image,
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
    submission?:string| null;
    submission_attachment?: string | null;
    status:string;
    verification:boolean;
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
            <AddTask
              onClose={() => setIsAddingTask(false)}
              onSubmit={async (submittedTask) => {
                if (!user || !user.userID) {
                  Alert.alert("Error", "User not found.");
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
                      ...submittedTask,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const data = await response.json();
                  if (data.success) {
                    Alert.alert("Success", "Task added successfully!");
                    setIsAddingTask(false);
                    setReloadTrigger((prev) => !prev);
                  }
                  setReloadTrigger(prev => !prev);
                  setIsAddingTask(false)

                } catch (error) {
                  console.error("Error adding task:", error);
                  Alert.alert("Error", "Failed to add task. Please try again.");
                }
              }}
            />
          ) : (
            selectedTask && (
              <TaskDetailPT
                selectedTask={selectedTask}
                isEditing={isEditing}
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
