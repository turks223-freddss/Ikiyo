import React, { useState, useEffect } from 'react';
import TaskCard from '../../assets/Tasks/MyJournalTaskCard';
import TaskDetail from '../../assets/Tasks/TaskDetail';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    TextInput,
    Button,
    Image,
    ImageSourcePropType,
    Alert,
    Dimensions,
    useWindowDimensions,
    PixelRatio,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const MyJournal: React.FC = () => {
const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionText, setSubmissionText] = useState('');
    const [user, setUser] = useState<{ userID: number } | null>(null);
    const [taskList, setTaskList] = useState<TaskData[]>([]);
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
                        action: "list_assigned_to",
                        userID: user.userID,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data && data.tasks_assigned_to_user) {
                    setTaskList(data.tasks_assigned_to_user);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                Alert.alert("Error", "Failed to load tasks. Please try again later.");
            }
        };

        fetchTasks();
    }, [user]);

    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Journal</Text>

            <View style={[styles.content, isSmallScreen && styles.contentColumn]}>
                {/* Left: Task List */}
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
                            onPress={() => {
                                setSelectedTask(item);
                                setIsSubmitting(false);
                            }}
                        />
                    )}
                />
                </View>

                {/* Right: Task Details */}
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
    backgroundColor: '#f4f4f4',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: height * 0.02,
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
