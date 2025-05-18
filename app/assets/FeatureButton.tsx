import React from "react";
import { TouchableOpacity, View, StyleSheet, Image, ImageSourcePropType, ViewStyle } from "react-native";
import { normalize } from '../../assets/normalize';

interface FeatureButtonProps {
    onPress: () => void;
    icon: React.ReactNode;
    size?: number;
    style?: ViewStyle;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ onPress, icon, size = 50, style }) => { 
  const innerSize = size * 0.75;

    return (
    <TouchableOpacity onPress={onPress} style={[getStyles.outer(size), style]}>
        <View style={getStyles.inner(innerSize)}>
        {icon}
        </View>
    </TouchableOpacity>
    );
};

// Dynamic styles generated with proper typing
const getStyles = {
    outer: (size: number): ViewStyle => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "white",
        justifyContent: "center" as const,
        alignItems: "center" as const,
    }),
    inner: (size: number): ViewStyle => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#ffc9ac",
        justifyContent: "center" as const,
        alignItems: "center" as const,
    }),
    icon: (size: number) => ({
        width: size,
        height: size,
    }),
};

export default FeatureButton;
