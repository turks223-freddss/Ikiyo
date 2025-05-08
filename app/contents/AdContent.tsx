import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Video from 'react-native-video';
import { Ionicons } from "@expo/vector-icons";

const AdContent: React.FC = () => {
    const [paused, setPaused] = useState(true);

    const togglePlay = () => setPaused(!paused);

    return (
        <View style={styles.wrapper}>
            <View style={styles.videoContainer}>
                <Video
                    source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
                    resizeMode="cover"
                    style={styles.video}
                    controls={false} // native controls disabled to handle overlay
                    paused={paused}
                    repeat
                />

                {/* Overlay if paused */}
                {paused && (
                    <TouchableOpacity style={styles.overlay} onPress={togglePlay}>
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={48} color="white" />
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* Claim Button - disabled */}
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
        height: "80%",
        backgroundColor: "#000",
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    playButton: {
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 20,
        borderRadius: 50,
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
