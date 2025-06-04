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
import { normalize } from '../../../assets/normalize';

const { width, height } = Dimensions.get('window');

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

type PartnerJournalProps = {
  userData: {
    userID: number;
    username: string;
    email: string;
    password: string;
    gold: number;
    ruby: number;
    description: string | null;
    buddy: number | null;
  } | null;
  openPartnerProfile?: () => void;
};

const PartnerJournal: React.FC<PartnerJournalProps> = ({ userData, openPartnerProfile }) => {
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
  const [componentReloadKey, setComponentReloadKey] = useState(0);

  const forceRemountTaskDetail = () => {
    setComponentReloadKey(prev => prev + 1); // forces remount
  };

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
        const response = await fetch("http://10.0.2.2:8000/api/task-action/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "list_assigned_by",
            userID: user.userID,
          }),
        });

        if (response.status === 404) {
          // No tasks found, but not an error
          setTaskList([]);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.tasks_assigned_by_user) {
          setTaskList(data.tasks_assigned_by_user);
          if (selectedTask) {
            const updated = data.tasks_assigned_by_user.find((t:TaskData) => t.id === selectedTask.id);
            if (updated) {
              setSelectedTask(updated); // this is a new object ref
            }
          }
        } else {
          setTaskList([]); // No tasks in response
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        Alert.alert("Error", "Failed to load tasks. Please try again later.");
      }
    };

    fetchTasks();
  }, [user, reloadTrigger]);

  // --- Buddy check logic ---
  if (!userData || !userData.buddy) {
    return (
      <View style={{
  flex: 1,
  width: '100%',
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.10)",
}}>
  <View style={{
    backgroundColor: "#FFD2B3",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7A6B63",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 270,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  }}>
    <Text style={{
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
      textShadowColor: "#7A6B63",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      marginBottom: 8,
      letterSpacing: 1,
      textAlign: "center",
      textTransform: "uppercase",
      fontFamily: "sans-serif",
    }}>
      NO BUDDY
    </Text>
    <Text style={{
      fontSize: 15,
      color: "#7A6B63",
      textAlign: "center",
      marginBottom: 18,
      fontWeight: "500",
    }}>
      Add a buddy in the buddy tab of your profile to start creating/doing tasks.
    </Text>
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: 12,
    }}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "#4DD16E",
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#2B8C3E",
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 6,
        }}
        onPress={openPartnerProfile}
      >
        <Text style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 16,
        }}>
          Go
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
    );
  }

  return (
    <View key={componentReloadKey} style={styles.container}>
      <Text style={styles.title}>Partner Journal</Text>
      <View style={[styles.content, isSmallScreen && styles.contentColumn]}>
        <View style={[styles.leftColumn, isSmallScreen && styles.fullWidth]}>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              {taskList.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                  <Text style={{ color: '#888', fontSize: normalize(8), textAlign: 'center' }}>
                    You have yet to assign tasks to your buddy!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={taskList}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.taskList}
                  renderItem={({ item }) => (
                    <TaskCard
                      questImage={require('../../../assets/images/homeIcons/task.png')}
                      titleName={item.task_title}
                      rewardImage={require('../../../assets/images/homeIcons/ikicoin.png')}
                      status={item.status}
                      userID={user!.userID}
                      task_id={item.id}
                      reward={item.reward}
                      isSelf={0}
                      onPress={() => {
                        setSelectedTask({...item});
                        setIsEditing(false);
                        setIsAddingTask(false);
                      }}
                    />
                  )}
                />
              )}
            </View>
            <View style={styles.addTaskWrapper}>
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={() => {
                  setSelectedTask(null);
                  setIsEditing(false);
                  setIsAddingTask(true);
                }}
              >
                <Ionicons name="add" size={normalize(10)} color="#fff" />
              </TouchableOpacity>
            </View>
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
                  const response = await fetch("http://10.0.2.2:8000/api/task-action/", {
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
                key={componentReloadKey}
                selectedTask={selectedTask}
                isEditing={isEditing}
                submissionText={submissionText}
                userID={user!.userID}
                setIsEditing={setIsEditing}
                setSubmissionText={setSubmissionText}
                triggerReload={() => {
                  setReloadTrigger(prev => !prev); // refetch
                  forceRemountTaskDetail();        // force re-render
                }}
                clearSelectedTask={() => setSelectedTask(null)}
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
  },
  title: {
    fontSize: normalize(6),
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
    width: normalize(12),
    height: normalize(12),
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
  centeredOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noBuddyBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  noBuddyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginBottom: 10,
  },
  noBuddySubtitle: {
    fontSize: 15,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
  },
  noBuddyButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  noBuddyConfirm: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  noBuddyConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PartnerJournal;
