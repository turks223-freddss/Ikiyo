import React, { useState, useEffect } from 'react';
import TaskCard from '../../../assets/Tasks/MyJournalTaskCard';
import TaskDetail from '../../../assets/Tasks/TaskDetail';
import styles from './MyJournalTask.styles'
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
import { useRouter } from 'expo-router';
import eventBus from "../../../assets/utils/eventBus";
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '@/assets/normalize';

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
type MyJournalProps = {
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

const MyJournal: React.FC<MyJournalProps> = ({ userData, openPartnerProfile }) => {
const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionText, setSubmissionText] = useState('');
    const [user, setUser] = useState<{ userID: number } | null>(null);
    const [taskList, setTaskList] = useState<TaskData[]>([]);
    const { width } = useWindowDimensions();
    const router = useRouter(); // Add this line
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [componentReloadKey, setComponentReloadKey] = useState(0);

    const forceRemountTaskDetail = () => {
      setComponentReloadKey(prev => prev + 1); // forces remount
    };

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

            if (response.status === 404) {
                // No tasks found, but not an error
                setTaskList([]);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.tasks_assigned_to_user) {
                setTaskList(data.tasks_assigned_to_user);
                if (selectedTask) {
                    const updated = data.tasks_assigned_to_user.find((t: TaskData) => t.id === selectedTask.id);
                    if (updated) {
                        setSelectedTask(updated); // this is a new object ref
                    }
                }
            } else {
                setTaskList([]); // No tasks in response
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            // Only alert for real errors, not for empty task list
            Alert.alert("Error", "Failed to load tasks. Please try again later.");
        }
    };
    
    useEffect(() => {
        fetchTasks();
    }, [user,reloadTrigger]);

    if (!userData || !userData.buddy) {
        return (
            <View style={styles.centeredOverlay}>
                <View style={styles.noBuddyBox}>
                    <Text style={styles.noBuddyTitle}>NO BUDDY</Text>
                    <Text style={styles.noBuddySubtitle}>
                    Add a buddy in the buddy tab of your profile to start creating/doing tasks.
                    </Text>
                    <View style={styles.noBuddyButtonRow}>
                    
                    <TouchableOpacity
                        style={styles.noBuddyConfirm}
                        onPress={openPartnerProfile}
                    >
                        <Text style={styles.noBuddyConfirmText}>Go</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View key={componentReloadKey} style={styles.container}>
            <Text style={styles.title}>My Journal</Text>

            <View style={[styles.content, isSmallScreen && styles.contentColumn]}>
                {/* Left: Task List */}
                <View style={[styles.leftColumn, isSmallScreen && styles.fullWidth]}>
                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      {taskList.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                          <Text style={{ color: '#888', fontSize: normalize(8), textAlign: 'center' }}>
                            You currently do not have any tasks!
                          </Text>
                        </View>
                      ) : (
                        <FlatList
                          data={taskList}
                          keyExtractor={(item) => item.id.toString()}
                          contentContainerStyle={styles.taskList}
                          renderItem={({ item }) => (
                            <TaskCard
                              questImage={require('../../../../assets/images/homeIcons/task.png')}
                              titleName={item.task_title}
                              rewardImage={require('../../../../assets/images/homeIcons/ikicoin.png')}
                              status={item.status}
                              userID={user!.userID}
                              task_id={item.id}
                              isSelf={1}
                              reward={item.reward}
                              onPress={() => {
                                setSelectedTask(item);
                                setIsSubmitting(false);
                              }}
                              onClaimed={() => {
                                fetchTasks();
                                eventBus.emit("goldUpdate");
                              }}
                            />
                          )}
                        />
                      )}
                    </View>
                  </View>
                </View>

                {/* Right: Task Details */}
                <View style={[styles.rightColumn, isSmallScreen && styles.fullWidth]}>
                {selectedTask && (
                    <TaskDetail
                        key ={componentReloadKey}
                        selectedTask={selectedTask}
                        isSubmitting={isSubmitting}
                        submissionText={submissionText}
                        userID={user!.userID}
                        isSelf={1}
                        setIsSubmitting={setIsSubmitting}
                        setSubmissionText={setSubmissionText}
                        triggerReload = {() => {
                            setReloadTrigger(prev => !prev);
                            forceRemountTaskDetail();
                        }}
                    />
                )}
            </View>
        </View>
    </View>
  );
};

export default MyJournal;
