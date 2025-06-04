import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
    attachment?: string | null;
    submission?: string | null;
    submission_attachment?: string | null;
    status: string;
    verification: boolean;
  } | null;
  isEditing: boolean;
  submissionText: string;
  userID: number;
  setIsEditing: (val: boolean) => void;
  setSubmissionText: (val: string) => void;
  triggerReload: () => void;
  clearSelectedTask: () => void;
};

const TaskDetailPT: React.FC<TaskDetailProps> = ({
  selectedTask,
  isEditing,
  submissionText,
  userID,
  setIsEditing,
  setSubmissionText,
  triggerReload,
  clearSelectedTask,
}) => {
  if (!selectedTask) return null;

  const [editedTask, setEditedTask] = useState({
    task_title: selectedTask.task_title || '',
    task_description: selectedTask.task_description || '',
    difficulty_level: 'Easy',
    image: selectedTask.attachment || null,
  });

  const [viewSubmission, setViewSubmission] = useState(false);
  const [removedAttachment, setRemovedAttachment] = useState(false);

  useEffect(() => {
    if (isEditing && selectedTask) {
      setEditedTask({
        task_title: selectedTask.task_title || '',
        task_description: selectedTask.task_description || '',
        difficulty_level: 'Easy',
        image: selectedTask.attachment || null,
      });
    }
  }, [isEditing]);

  const handleEditTask = async () => {
    if (!editedTask.task_title || !editedTask.task_description) {
      Alert.alert("Validation Error", "Please fill in the title and description.");
      return;
    }
    console.log(JSON.stringify({
      action: "edit",
      task_id: selectedTask.id,
      userID: userID,
      task_title: editedTask.task_title,
      task_description: editedTask.task_description,
      difficulty_level: editedTask.difficulty_level,
      attachment: editedTask.image || "",
    }));
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
          attachment:editedTask.image||"",
        }),
      });
      console.log(editedTask.image)
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Task updated successfully!");
        setIsEditing(false);
        setRemovedAttachment(false);
        triggerReload();
        setEditedTask({
          task_title: selectedTask.task_title || '',
          task_description: selectedTask.task_description || '',
          difficulty_level: 'Easy',
          image: selectedTask.attachment || null,
        });
      } else {
        Alert.alert("Error", "Failed to update task.");
      }

    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task. Please try again later.");
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch("http://192.168.1.5:8081/api/task-action/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          task_id: selectedTask.id,
          userID: userID,
          verified: true
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Submission approved!");
        triggerReload();
      } else {
        Alert.alert("Error", data.error || "Approval failed.");
      }
    } catch (error) {
      console.error("Approve error:", error);
      Alert.alert("Error", "Approval failed.");
    }
  };

  const handledelete = async () => {
    try {
      const response = await fetch("http://192.168.1.5:8081/api/task-action/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          userID: userID,
          task_id: selectedTask.id
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Task Deleted");
        triggerReload();
        clearSelectedTask(); 
      } else {
        Alert.alert("Error", data.error || "Task Delete failed.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Delete failed.");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'inprogress':
        return { backgroundColor: 'gray' };
      case 'for validation':
        return { backgroundColor: '#2196F3' };
      case 'complete':
        return { backgroundColor: 'green' };
      default:
        return { backgroundColor: '#ccc' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.details}>
        {viewSubmission ? (
          // --- SUBMISSION-ONLY VIEW ---
          <>
            <View style={[styles.statusContainer, getStatusStyle(selectedTask.status)]}>
              <Text style={styles.statusText}>Submission Details</Text>
            </View>

            <Text style={styles.description}>Submission: {selectedTask.submission}</Text>

            {selectedTask.submission_attachment ? (
              <Image
                source={{ uri: selectedTask.submission_attachment }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ color: 'gray' }}>No submission image</Text>
            )}

            <Text style={styles.description}>Status: {selectedTask.status}</Text>

            {selectedTask.status.toLowerCase() === 'for validation' && (
              <View style={{ marginTop: normalize(8) }}>
                <Button title="Approve Submission" onPress={handleApprove} color="#009688" />
              </View>
            )}

          </>
        ) : (
          // --- REGULAR TASK DETAIL VIEW ---
          <>
            <View style={[styles.statusContainer, getStatusStyle(selectedTask.status)]}>
              <Text style={styles.statusText}>
                {selectedTask.task_title} ({selectedTask.status})
              </Text>
            </View>

            {!isEditing ? (
              <>
                <Text style={styles.description}>{selectedTask.task_description}</Text>
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
                {selectedTask.attachment && !removedAttachment && (
                   <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: normalize(8) }}>
                      <Image
                        source={{ uri: selectedTask.attachment }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setRemovedAttachment(true);
                          setEditedTask((prev) => ({ ...prev, image: null }))
                        }}
                        style={{
                          marginLeft: normalize(8),
                          backgroundColor: '#f44336',
                          paddingVertical: normalize(4),
                          paddingHorizontal: normalize(8),
                          borderRadius: normalize(4),
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: normalize(8) }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                )}
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

           
          </>
        )}
      </ScrollView>
      <View style = {styles.bottomButtonContainer}>
         {!isEditing && (
              <View style={styles.buttonRow}>
                  {selectedTask.status === 'Inprogress' &&(
                    <TouchableOpacity 
                      style={[styles.button, { backgroundColor: '#4CAF50' }]}
                      onPress={() => setIsEditing(true)}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    )}

                  {selectedTask.status === 'Inprogress' && (
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#f44336' }]}
                      onPress={() => handledelete()}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                  {selectedTask.submission && selectedTask.submission.trim() !== '' &&(
                      
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#3F51B5' }]}
                      onPress={() => setViewSubmission(!viewSubmission)}
                    >
                    <Text style={styles.buttonText}>
                      {viewSubmission ? 'Hide Submission' : 'View Submission'}
                    </Text>
                    </TouchableOpacity>
                      
                  )}
                    
              </View>
            )}

            {isEditing && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#f44336' }]}
                  onPress={() => {setIsEditing(false);
                    setRemovedAttachment(false);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#4CAF50' }]}
                 onPress={() => {
                    handleEditTask();
                    setRemovedAttachment(false);
                  }}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}

      </View>
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
    paddingBottom: normalize(60),
    paddingTop: normalize(6),
  },
  statusContainer: {
    padding: normalize(6),
    borderRadius: normalize(6),
    marginBottom: normalize(8),
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: normalize(11),
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
    width:"100%",
    flexDirection: 'row',
    justifyContent: 'space-between', // or 'space-evenly'
    paddingHorizontal: normalize(12),
    paddingBottom: normalize(12),
    gap: normalize(8), // optional: for consistent spacing if using 'space-between'
  },

  button: {
    borderRadius: normalize(6),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: normalize(40),
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(7),
    fontWeight: 'bold',
  },

  bottomButtonContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: '#fff',
  paddingVertical: normalize(10),
  borderTopWidth: 1,
  borderColor: '#ccc',
  paddingHorizontal: normalize(12),
},
});

export default TaskDetailPT;
