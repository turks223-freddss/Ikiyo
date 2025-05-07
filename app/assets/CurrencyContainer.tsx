import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CurrencyDisplayProps {
  icon: React.ReactNode;
  currencyAmount: number;
  size?: number;       // diameter of the icon
  boxSize?: number;    // optional, no longer used strictly
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  icon,
  currencyAmount,
  size = 80,
}) => {
  return (
    <View style={[styles.container]}>
      <View style={[styles.iconCircle, { width: size, height: size }]}>
        <View style={styles.iconContainer}>{icon}</View>
      </View>

      <View
        style={[
          styles.currencyBox,
          {
            height: size,
            width: size*4,
            paddingLeft: size * 0.6 + 10, // enough space to show text clearly
          },
        ]}
      >
        <View style={{ alignItems: "center" }}>
            <Text style={styles.currencyText}>{currencyAmount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  iconCircle: {
    zIndex: 1,
    marginRight: -40, // Pull into the box
    borderRadius: 100,
    //backgroundColor: "white",
    //borderWidth: 2,
    //borderColor: "silver",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  currencyBox: {
    backgroundColor: "rgba(255, 201, 172, 0.85)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",     // Center all children
    flex: 1,                  // Allow it to fill available space
  },
  
  

  currencyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  } as TextStyle,
});

export default CurrencyDisplay;
