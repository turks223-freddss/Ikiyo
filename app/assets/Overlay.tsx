import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OverlayWindowProps {
  visible: boolean;
  onClose: () => void;
  tabs: 1 | 2 | 3;
  tab1: React.ReactNode;
  tab2?: React.ReactNode;
  tab3?: React.ReactNode;
  tab1icon?: any; // Can be image source
  tab1label?: string;
  tab2icon?: any;
  tab2label?: string;
  tab3icon?: any;
  tab3label?: string;
}

const OverlayWindow: React.FC<OverlayWindowProps> = ({
  visible,
  onClose,
  tabs,
  tab1,
  tab2,
  tab3,
  tab1icon,
  tab1label,
  tab2icon,
  tab2label,
  tab3icon,
  tab3label,
}) => {
  const { width, height } = Dimensions.get("window");
  const [selectedTab, setSelectedTab] = useState<number>(1);

  if (!visible) return null;

  const renderContent = () => {
    switch (selectedTab) {
      case 2:
        return tab2;
      case 3:
        return tab3;
      case 1:
      default:
        return tab1;
    }
  };

  const renderTabButton = (
    index: number,
    icon?: any, // Can be an image source or custom icon
    label?: string
  ) => (
    <TouchableOpacity
      key={index}
      onPress={() => setSelectedTab(index)}
      style={[
        styles.tabButton,
        selectedTab === index && styles.selectedTabButton,
      ]}
    >
      {/* Render image as icon */}
      {icon && <Image source={icon} style={styles.iconImage} />}
      <Text style={styles.tabText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[
              styles.window,
              { width: width * 0.85, height: height * 0.9 },
            ]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeIconWrapper}>
                <Ionicons name="close" size={20} color="red" />
              </View>
            </TouchableOpacity>

            <View style={styles.container}>
              {tabs > 1 && (tab1icon || tab2icon || tab3icon) && (
                <View style={styles.tabSelector}>
                  <View>
                    {renderTabButton(1, tab1icon, tab1label)}
                    {tabs >= 2 && renderTabButton(2, tab2icon, tab2label)}
                    {tabs === 3 && renderTabButton(3, tab3icon, tab3label)}
                  </View>
                </View>
              )}
              <View
                style={[
                  styles.innerWindow,
                  tabs === 1 && { width: "100%" }, // Expand if no selector
                ]}
              >
                {renderContent()}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  window: {
    backgroundColor: "rgba(255, 201, 172, 0)",
    borderRadius: 15,
    paddingTop: 10,
    flexDirection: "row",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  tabSelector: {
    paddingTop: 30,
    paddingHorizontal: 8,
    justifyContent: "flex-start",
  },
  tabButton: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 12,
    borderRadius: 10,
    marginLeft: 15,
    backgroundColor: "#f8d7c4",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTabButton: {
    backgroundColor: "#f29773",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "#000",
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  innerWindow: {
    backgroundColor: "rgba(255, 201, 172, 1)",
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default OverlayWindow;
