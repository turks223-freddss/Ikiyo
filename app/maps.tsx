import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Maps() {
    const router = useRouter();

    return (
        <View style={styles.container}>
        {/* School Button */}
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(school_tabs)/school")}> 
            <MaterialIcons name="school" size={30} color="white" />
            <Text style={styles.buttonText}>School</Text>
        </TouchableOpacity>

        {/* Home Button */}
        <TouchableOpacity style={styles.button} onPress={() => router.push("/")}> 
            <FontAwesome5 name="home" size={30} color="white" />
            <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        {/* Community Park Button */}
        <TouchableOpacity style={styles.button} onPress={() => router.push("/community")}> 
            <MaterialIcons name="park" size={30} color="white" />
            <Text style={styles.buttonText}>Community Park</Text>
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FF5A5F",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 5,
    },
    });
