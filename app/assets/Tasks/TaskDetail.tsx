import React,{useState, useEffect} from 'react';
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
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { uploadToCloudinary } from "../Tasks/CloudinaryUpload"

// Normalize function for responsive scaling
const { width } = Dimensions.get('window');
const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

type TaskDetailProps = {
  selectedTask: {
    id:number
    task_title: string;
    task_description?: string;
    attachment?: string | null;
    submission?: string | null;
    submission_attachment?: string | null;
    status: string;
    verification: boolean;
  } | null;
  userID: number;
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
  userID,
  setIsSubmitting,
  setSubmissionText,
  isSelf,
}) => {
  if (!selectedTask) return null;
  const [submissionImage, setSubmissionImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [documentUri, setDocumentUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera roll permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images','videos','livePhotos'],
      quality: 1,
    });

    setShowAttachmentOptions(false);

    if (!result.canceled) {
      setSubmissionImage(result.assets[0].uri);
      setShowAttachmentOptions(false);
      setDocumentUri(null); // clear document when image is selected
    }
  };

  const takeImage = async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera roll permission is required.');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images','videos','livePhotos'],
        quality: 1,
      });
      setShowAttachmentOptions(false);
      if (!result.canceled) {
        setSubmissionImage(result.assets[0].uri);
        setShowAttachmentOptions(false);
        setDocumentUri(null); // clear document when image is selected
      }
    };
  
    const pickDocument = async () => {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });
      setShowAttachmentOptions(false);
      if (!result.canceled && result.assets.length > 0) {
        setDocumentUri(result.assets[0].uri);
        setShowAttachmentOptions(false);
        setSubmissionImage(null); // clear image when document is selected
      }
    };


  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      alert("Please write something before submitting.");
      return;
    }

    setIsLoading(true);
    let uploadedUrl = null;

    try {
      if (submissionImage && documentUri) {
        alert("Please attach only an image *or* a document, not both.");
        setIsLoading(false);
        return;
      }

      if (submissionImage) {
        uploadedUrl = await uploadToCloudinary(submissionImage);
      } else if (documentUri) {
        uploadedUrl = await uploadToCloudinary(documentUri);
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      Alert.alert('Upload Error', 'Failed to upload attachment.');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("http://192.168.1.5:8081/api/task-action/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action:"submit",
          userID:userID,
          task_id: selectedTask.id,
          submission: submissionText,
          submission_attachment: uploadedUrl || null,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      alert("Submission sent!");
      setIsSubmitting(false);
      setSubmissionText('');
      setSubmissionImage(null);
    } catch (error) {
      alert("Error submitting task.");
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.details}>
        <Text style={styles.detailTitle}>{selectedTask.task_title}</Text>

        {!isSubmitting ? (
          <>
            <Text style={styles.description}>{selectedTask.task_description}</Text>
            {selectedTask.attachment && (
              <Image source={{ uri: selectedTask.attachment }} style={styles.image} resizeMode="contain" />
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
            {submissionImage && (
              <Image
                source={{ uri: submissionImage }}
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 8,
                  marginTop: 10,
                }}
                resizeMode="cover"
              />
            )}
  
            {documentUri && !submissionImage && (
              <Text style={{ marginTop: 10 }}>Selected Document: {documentUri.split('/').pop()}</Text>
            )}
            {!showAttachmentOptions ? (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={() => setShowAttachmentOptions(true)}
              >
                <Text style={styles.buttonText}>
                  {submissionImage || documentUri ? 'Change Attachment' : 'Add Attachment'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                <TouchableOpacity
                  style={[styles.addImageButton, { backgroundColor: '#2196F3' }]}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>Image</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.addImageButton, { backgroundColor: '#2196F3' }]}
                  onPress={takeImage}
                >
                  <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.addImageButton, { backgroundColor: '#9C27B0' }]}
                  onPress={pickDocument}
                >
                  <Text style={styles.buttonText}>Document</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.addImageButton, { backgroundColor: '#f44336' }]}
                  onPress={() => setShowAttachmentOptions(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
              </View>
            )}
          
          
          
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
          <TouchableOpacity style={styles.smallButton} onPress={handleSubmit} disabled={isLoading}>
            <Text style={styles.smallButtonText}>{isLoading ? "Submitting..." : "Submit"}</Text>
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
    buttonText: {
    color: '#fff',
    fontSize: normalize(7),
    fontWeight: 'bold',
  },
});

export default TaskDetail;
