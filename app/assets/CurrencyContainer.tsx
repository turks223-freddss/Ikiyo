import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { normalize } from '../../assets/normalize';

interface CurrencyDisplayProps {
  icon: React.ReactNode;
  currencyAmount: number;
  size?: number;       // size of icon
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  icon,
  currencyAmount,
  size = 40, // More compact by default
}) => {
  return (
    <View
      style={[
        styles.currencyContainer,
        {
          height: size + 20,
          borderRadius: (size + 20) / 2,
          paddingRight: size * 0.6,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            marginRight: 10,
          },
        ]}
      >
        {icon}
      </View>

      <Text style={[styles.currencyText, { fontSize: normalize(6) }]}>
        {currencyAmount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  currencyContainer: {
    backgroundColor: "rgba(255, 201, 172, 0.85)",
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  iconWrapper: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,

  currencyText: {
    fontWeight: "bold",
    color: "#222",
    marginLeft: normalize(3),
    marginRight: normalize(6),
  } as TextStyle,
});

export default CurrencyDisplay;
