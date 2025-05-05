// components/AdContent.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const AdContent: React.FC = () => {
    return (
        <View style={styles.wrapper}>
        {/* Placeholder for video */}
        <View style={styles.videoContainer}>
            <Text style={{ color: "#333" }}>[ Video Placeholder ]</Text>
        </View>

        {/* Disabled Claim Button */}
        <TouchableOpacity disabled style={styles.claimButton}>
            <Text style={styles.buttonText}>Play to Claim Rewards</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 30,
    },
    videoContainer: {
        width: "80%",
        height: "85%",
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    claimButton: {
        backgroundColor: "gray",
        opacity: 0.6,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default AdContent;
