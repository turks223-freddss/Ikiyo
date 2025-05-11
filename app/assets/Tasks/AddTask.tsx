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
} from 'react-native';
import CustomSelector from './difficultyselector';

const { width, height } = Dimensions.get('window');

const normalize = (size: number) => {
  const scale = Math.min(width / 375, 1);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

type AddTaskProps = {
  onClose: () => void;  // Add this prop
};

const AddTask: React.FC<AddTaskProps> = ({ onClose }) => {
  const [difficulty, setDifficulty] = useState('Set Difficulty...');
  const [newTask, setNewTask] = useState({
    title: '',
    difficulty: 'Easy',
    description: '',
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.title}>Add New Task</Text>

          {/* Title and Difficulty Selector in Same Row */}
          <View style={styles.titleDifficultyRow}>
            <TextInput
              style={styles.titleInput}
              placeholder="Task title"
              value={newTask.title}
              onChangeText={(text) =>
                setNewTask({ ...newTask, title: text })
              }
            />
            <View style={styles.selectorWrapper}>
              <CustomSelector
                value={difficulty}
                onSelect={setDifficulty}
                options={[
                  { label: 'Easy', value: 'Easy' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'Hard', value: 'Hard' },
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
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
            />
          </View>

          {/* Add Image button */}
          <TouchableOpacity style={styles.addImageButton}>
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons Row fixed at bottom */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText }>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.addButton]}>
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
});

export default AddTask;
