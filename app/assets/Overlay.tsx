import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { normalize } from "@/assets/normalize";

interface OverlayWindowProps {
  visible: boolean;
  onClose: () => void;
  tabs: 1 | 2 | 3;
  tab1: React.ReactNode;
  tab2?: React.ReactNode;
  tab3?: React.ReactNode;
  tab1icon?: any; // Can be image source
  tab2icon?: any;
  tab3icon?: any;
  width?: number;   // optional width
  height?: number;  // optional height
}

const OverlayWindow: React.FC<OverlayWindowProps> = ({
  visible,
  onClose,
  tabs,
  tab1,
  tab2,
  tab3,
  tab1icon,
  tab2icon,
  tab3icon,
  width,
  height,
}) => {
  const windowDimensions = Dimensions.get("window");

  // Use provided width/height or fallback to window size
  const containerWidth = width ?? windowDimensions.width * 0.85;
  const containerHeight = height ?? windowDimensions.height * 0.9;

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

  const renderTabButton = (index: number, icon?: any) => (
    <TouchableOpacity
      key={index}
      onPress={() => setSelectedTab(index)}
      style={[
        styles.tabButton,
        selectedTab === index && styles.selectedTabButton,
      ]}
    >
      {icon && <Image source={icon} style={styles.iconImage} />}
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[
              styles.window,
              { width: containerWidth, height: containerHeight },
            ]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeIconWrapper}>
                <Ionicons name="close" size={20} color="white" />
              </View>
            </TouchableOpacity>

            <View style={styles.container}>
              {tabs > 1 && (tab1icon || tab2icon || tab3icon) && (
                <View style={styles.tabSelector}>
                  <View>
                    {renderTabButton(1, tab1icon)}
                    {tabs >= 2 && renderTabButton(2, tab2icon)}
                    {tabs === 3 && renderTabButton(3, tab3icon)}
                  </View>
                </View>
              )}
              <View style={[styles.innerWindow, tabs === 1 && { width: "100%" }]}>
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
    zIndex: 10,
  },
  window: {
    backgroundColor: "rgba(255, 201, 172, 0)",
    borderRadius: 15,
    paddingTop: 10,
    flexDirection: "row",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: -20,
    zIndex: 1,
  },
  closeIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  tabSelector: {
    paddingTop: normalize(10),
    paddingRight: normalize(3),
    justifyContent: "flex-start",
  },
  tabButton: {
    width: "100%",
    paddingVertical: normalize(2),
    paddingHorizontal: normalize(1),
    marginBottom: normalize(2),
    borderRadius: 10,
    marginLeft: normalize(4),
    backgroundColor: "#f8d7c4",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTabButton: {
    backgroundColor: "#f29773",
  },
  iconImage: {
    width: normalize(15),
    height: normalize(15),
  },
  innerWindow: {
    backgroundColor: "rgba(255, 201, 172, 1)",
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
});

export default OverlayWindow;
