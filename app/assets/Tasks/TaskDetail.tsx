import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';

type TaskDetailProps = {
  selectedTask: {
    task_title: string;
    task_description?: string;
    previewImage?: ImageSourcePropType;
  } | null;
  isSubmitting: boolean;
  submissionText: string;
  setIsSubmitting: (val: boolean) => void;
  setSubmissionText: (val: string) => void;
};

const TaskDetail: React.FC<TaskDetailProps> = ({
  selectedTask,
  isSubmitting,
  submissionText,
  setIsSubmitting,
  setSubmissionText,
}) => {
  if (!selectedTask) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.details}>
        <Text style={styles.detailTitle}>{selectedTask.task_title}</Text>

        {!isSubmitting ? (
          <>
            <Text style={styles.description}>{selectedTask.task_description}</Text>
            {selectedTask.previewImage && (
              <Image source={selectedTask.previewImage} style={styles.image} resizeMode="contain" />
            )}
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Write your submission..."
              multiline
              value={submissionText}
              onChangeText={setSubmissionText}
            />
            <Button title="Add Image" onPress={() => {}} color="#2196F3" />
          </>
        )}
      </ScrollView>

      {/* Always shows "Add Submission" at the bottom when not submitting */}
      {!isSubmitting && (
        <View style={styles.fixedButtonContainer}>
          <Button title="Add Submission" onPress={() => setIsSubmitting(true)} color="#4CAF50" />
        </View>
      )}

      {/* Cancel and Submit buttons appear only when submitting */}
      {isSubmitting && (
        <View style={styles.buttonRow}>
          <Button title="Cancel" onPress={() => setIsSubmitting(false)} color="#f44336" />
          <Button title="Submit" onPress={() => {}} color="#4CAF50" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  details: {
    paddingBottom: 100, // Provide space for buttons at the bottom
    paddingTop: 10,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
    lineHeight: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
  },
});

export default TaskDetail;
