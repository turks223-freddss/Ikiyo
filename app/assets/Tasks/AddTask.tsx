import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import CustomSelector from './difficultyselector';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from "../Tasks/CloudinaryUpload"
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');

const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

type AddTaskProps = {
  onClose: () => void;  // Add this prop
  onSubmit: (task: {
    task_title: string;
    task_description: string;
    difficulty_level: string;
    attachment?: string | null;
  }) => void;
};

const AddTask: React.FC<AddTaskProps> = ({ onClose, onSubmit }) => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
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

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setDocumentUri(result.assets[0].uri);
      setShowAttachmentOptions(false);
    }
  };

  const handleAddPress = async () => {
    if (!newTask.title || !newTask.description) {
      Alert.alert("Validation Error", "Please fill in the title and description.");
      return;
    }

    let uploadedUrl = '';

    if (imageUri || documentUri) {
      try {
        setUploading(true);
        uploadedUrl = await uploadToCloudinary(imageUri || documentUri!); // pick one
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        Alert.alert('Upload Error', 'Failed to upload attachment.');
        setUploading(false);
        return;
      }
    }

    onSubmit({
      task_title: newTask.title,
      task_description: newTask.description,
      difficulty_level: difficulty,
       ...(uploadedUrl && { attachment: uploadedUrl })
    });
    setNewTask({ title: '', description: '' });
    setDifficulty('Easy');
    setImageUri(null);

    setUploading(false);
  };  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
         <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add New Task</Text>

          {/* Title and Difficulty Selector in Same Row */}
          <View style={styles.titleDifficultyRow}>
            <TextInput
              style={styles.titleInput}
              placeholder="Task title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            <View style={styles.selectorWrapper}>
              <CustomSelector
                value={difficulty}
                onSelect={setDifficulty}
                options={[
                  { label: 'Easy', value: 'Easy' },
                  { label: 'Very Easy', value: 'Very Easy' },
                  { label: 'Normal', value: 'Normal' },
                  { label: 'Hard', value: 'Hard' },
                  { label: 'Very Hard', value: 'Very Hard' },
                ]}
              />
            </View>
          </View>

          {/* Description input */}
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Task description"
              value={newTask.description}
              multiline
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
            />
          </View>

          {/* Add Image button */}
          {!showAttachmentOptions ? (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => setShowAttachmentOptions(true)}
            >
              <Text style={styles.buttonText}>
                {imageUri || documentUri ? 'Change Attachment' : 'Add Attachment'}
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

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 8,
                marginTop: 10,
              }}
              resizeMode="cover"
            />
          )}

          {documentUri && !imageUri && (
            <Text style={{ marginTop: 10 }}>Selected Document: {documentUri.split('/').pop()}</Text>
          )}
        </ScrollView>

        {/* Buttons Row fixed at bottom */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={handleAddPress}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    paddingBottom: height * 0.02,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: normalize(4),
  },
  row: {
    height: normalize(35),
    marginBottom: normalize(10),
  },
  titleDifficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
    gap: normalize(8),
  },
  titleInput: {
    flex: 0.6,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: normalize(6),
    padding: normalize(8),
    fontSize: normalize(10),
  },
  selectorWrapper: {
    flex: 0.4,
    justifyContent: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: normalize(6),
    padding: normalize(8),
    fontSize: normalize(10),
  },
  descriptionInput: {
    minHeight: normalize(50),
    textAlignVertical: 'top',
  },
  addImageButton: {
    backgroundColor: '#4CAF50',
    width: '20%',
    borderRadius: normalize(6),
    paddingVertical: normalize(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(20),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: normalize(6),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: normalize(40),
  },
  cancelButton: {
    backgroundColor: '#f44336',
    marginRight: normalize(6),
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginLeft: normalize(6),
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(7),
    fontWeight: 'bold',
  },

  scrollContent: {
  paddingBottom: 20,
  flexGrow: 1,
  },
});

export default AddTask;
