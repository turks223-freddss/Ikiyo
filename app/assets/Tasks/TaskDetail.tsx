import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';

// Normalize function for responsive scaling
const { width } = Dimensions.get('window');
const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

type TaskDetailProps = {
  selectedTask: {
    titleName: string;
    description?: string;
    previewImage?: ImageSourcePropType;
  } | null;
  isSubmitting: boolean;
  submissionText: string;
  setIsSubmitting: (val: boolean) => void;
  setSubmissionText: (val: string) => void;
  isSelf: 0 | 1;  // New prop to conditionally show/hide the button
};

const TaskDetail: React.FC<TaskDetailProps> = ({
  selectedTask,
  isSubmitting,
  submissionText,
  setIsSubmitting,
  setSubmissionText,
  isSelf,
}) => {
  if (!selectedTask) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.details}>
        <Text style={styles.detailTitle}>{selectedTask.titleName}</Text>

        {!isSubmitting ? (
          <>
            <Text style={styles.description}>{selectedTask.description}</Text>
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
            <TouchableOpacity style={styles.addImageButton} onPress={() => {}}>
              <Text style={styles.addImageButtonText}>Add Image</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Show "Add Submission" button only if isSelf === 1 */}
      {isSelf === 1 && !isSubmitting && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.smallButton} onPress={() => setIsSubmitting(true)}>
            <Text style={styles.smallButtonText}>Add Submission</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cancel and Submit buttons when submitting */}
      {isSelf === 1 && isSubmitting && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.smallButton, styles.cancelButton]}
            onPress={() => setIsSubmitting(false)}
          >
            <Text style={styles.smallButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={() => {}}>
            <Text style={styles.smallButtonText}>Submit</Text>
          </TouchableOpacity>
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
    paddingBottom: normalize(60),
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
    alignItems: 'flex-end',
  },
  smallButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(4),
    alignItems: 'center',
  },
  smallButtonText: {
    fontSize: normalize(10),
    color: '#fff',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  addImageButton: {
    backgroundColor: '#2196F3',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(4),
    alignItems: 'center',
    marginBottom: normalize(8),
    alignSelf: 'flex-start',
  },
  addImageButtonText: {
    fontSize: normalize(10),
    color: '#fff',
    fontWeight: '500',
  },
});

export default TaskDetail;
