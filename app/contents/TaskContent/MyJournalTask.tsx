import React, { useState, useEffect } from 'react';
import TaskCard from '../../assets/Tasks/MyJournalTaskCard';
import TaskDetail  from '../../assets/Tasks/TaskDetail';
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
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Task structure using your format
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

            <View style={styles.content}>
                {/* Left: Task List */}
                <View style={styles.leftColumn}>
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
                <View style={styles.rightColumn}>
                {selectedTask && (
                    <TaskDetail
                        selectedTask={selectedTask}
                        isSubmitting={isSubmitting}
                        submissionText={submissionText}
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
    taskList: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rewardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    rewardIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    reward: {
        fontSize: 14,
        color: '#666',
    },
    details: {
        paddingBottom: 20,
    },
    detailTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 10,
    },
});

export default MyJournal;
