import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  ImageSourcePropType,
  Alert,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Normalize function for responsive scaling
const { width } = Dimensions.get('window');
const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

type TaskDetailProps = {
  selectedTask: {
    id: number;
    task_title: string;
    task_description?: string;
    attachment?: string|null;
    submission?:string| null;
    submission_attachment?: string | null;
    staus:string;
    verification:boolean;
  } | null;
  isEditing: boolean;
  submissionText: string;
  userID: number;
  setIsEditing: (val: boolean) => void;
  setSubmissionText: (val: string) => void;
  triggerReload: () => void;
};

const TaskDetailPT: React.FC<TaskDetailProps> = ({
  selectedTask,
  isEditing,
  submissionText,
  userID,
  setIsEditing,
  setSubmissionText,
  triggerReload,
}) => {
  if (!selectedTask) return null;

  const [editedTask, setEditedTask] = useState({
    task_title: selectedTask.task_title || '',
    task_description: selectedTask.task_description || '',
    difficulty_level: 'Easy',
    image: null as ImageSourcePropType | null,
  });

  useEffect(() => {
    if (isEditing && selectedTask) {
      setEditedTask({
        task_title: selectedTask.task_title || '',
        task_description: selectedTask.task_description || '',
        difficulty_level: 'Easy',
        image: null,
      });
    }
  }, [isEditing]);

  const handleEditTask = async () => {
    if (!editedTask.task_title || !editedTask.task_description) {
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
          action: "edit",
          task_id: selectedTask.id,
          userID: userID,
          task_title: editedTask.task_title,
          task_description: editedTask.task_description,
          difficulty_level: editedTask.difficulty_level,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Task updated successfully!");
        
        // Optional: Refresh task list if needed
      } else {
        Alert.alert("Error", "Failed to update task.");
      }
      setIsEditing(false);
      triggerReload();
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.details}>
        <Text style={styles.detailTitle}>{selectedTask.task_title}</Text>

        {!isEditing ? (
          <>
            <Text style={styles.description}>{selectedTask.task_description}</Text>
            {console.log(selectedTask.attachment)}
           {selectedTask.attachment ? (
              <Image
                source={{ uri: selectedTask.attachment }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ color: 'gray' }}>No image attached</Text>
            )}
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editedTask.task_title}
              onChangeText={(text) =>
                setEditedTask((prev) => ({ ...prev, task_title: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={editedTask.task_description}
              onChangeText={(text) =>
                setEditedTask((prev) => ({ ...prev, task_description: text }))
              }
              multiline
            />
            <Picker
              selectedValue={editedTask.difficulty_level}
              onValueChange={(itemValue) =>
                setEditedTask((prev) => ({ ...prev, difficulty_level: itemValue }))
              }
            >
              <Picker.Item label="Easy" value="Easy" />
              <Picker.Item label="Very Easy" value="Very Easy" />
              <Picker.Item label="Normal" value="Normal" />
              <Picker.Item label="Hard" value="Hard" />
              <Picker.Item label="Very Hard" value="Very Hard" />
            </Picker>
            <Button title="Add Image" onPress={() => {}} color="#2196F3" />
          </>
        )}
      </ScrollView>

      {!isEditing && (
        <View style={styles.buttonRow}>
          <Button title="Edit" onPress={() => setIsEditing(true)} color="#4CAF50" />
          <Button title="Delete" onPress={() => Alert.alert("Delete pressed")} color="#f44336" />
        </View>
      )}

      {isEditing && (
        <View style={styles.buttonRow}>
          <Button title="Cancel" onPress={() => setIsEditing(false)} color="#f44336" />
          <Button title="Save" onPress={handleEditTask} color="#4CAF50" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: normalize(6),
    paddingHorizontal: normalize(12),
  },
  details: {
    paddingBottom: normalize(60), // Provide space for buttons at the bottom
    paddingTop: normalize(6),
  },
  detailTitle: {
    fontSize: normalize(12),
    fontWeight: '600',
    marginBottom: normalize(2),
    color: '#333',
  },
  description: {
    fontSize: normalize(9),
    marginBottom: normalize(8),
    color: '#555',
    lineHeight: normalize(18),
  },
  image: {
    width: '50%',
    height: normalize(60),
    borderRadius: normalize(6),
    marginBottom: normalize(8),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: normalize(4),
    padding: normalize(6),
    minHeight: normalize(80),
    marginBottom: normalize(8),
    fontSize: normalize(12),
    color: '#333',
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: normalize(8),
    paddingHorizontal: normalize(12),
    paddingBottom: normalize(12),
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: normalize(8),
    left: normalize(12),
    right: normalize(12),
    paddingHorizontal: normalize(12),
  },
});

export default TaskDetailPT;
