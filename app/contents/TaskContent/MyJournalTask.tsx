import React, { useState } from 'react';
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
} from 'react-native';

// Task structure using your format
type TaskData = {
    questImage: ImageSourcePropType;
    titleName: string;
    rewardImage: ImageSourcePropType;
    reward?: number;
    description?: string;
    previewImage?: ImageSourcePropType;
};

// Sample task data
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

    return (
        <View style={styles.container}>
        <Text style={styles.title}>My Journal</Text>

        <View style={styles.content}>
            {/* Left: Task List */}
            <View style={styles.leftColumn}>
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
