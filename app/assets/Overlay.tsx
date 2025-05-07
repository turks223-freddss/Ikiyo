import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OverlayWindowProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const OverlayWindow: React.FC<OverlayWindowProps> = ({ visible, onClose, children }) => {
  const { width, height } = Dimensions.get("window");

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[styles.window, { width: width * 0.8, height: height * 0.9 }]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeIconWrapper}>
                <Ionicons name="close" size={20} color="red" />
              </View>
            </TouchableOpacity>

            <View style={styles.innerWindow}>{children}</View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  window: {
    backgroundColor: "rgba(255, 201, 172, 1)",
    borderRadius: 15,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  innerWindow: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  closeIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18, // Makes it a circle
    borderWidth: 2,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  
});

export default OverlayWindow;
