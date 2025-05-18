import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { normalize } from '../../assets/normalize';

interface eCardProps {
    imageUri?: string; 
    username?: string;
    hashtag?: string; 
    onPress?: () => void;
}

const ProfileCard: React.FC<eCardProps> = ({ imageUri, username, hashtag, onPress }) => {
    // Placeholder values
    const placeholderImage = "https://via.placeholder.com/150";
    const placeholderUsername = "Username Here";
    const placeholderHashtag = "#Hashtag"; 

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
                <Image
                source={{ uri: imageUri || placeholderImage }}
                style={styles.profileImage}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.username}>{username || placeholderUsername}</Text>
                <Text style={styles.hashtag}>{hashtag || placeholderHashtag}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", // Arrange elements horizontally
        alignItems: "center", // Center vertically
        backgroundColor: "rgba(255, 201, 172, 0.85)", 
        paddingVertical: normalize(1), // reduced from 15
        borderRadius: 200, // Rounded corners
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // Shadow effect for elevation on Android
    },
    imageContainer: {
        width: normalize(25),
        height: normalize(25),
        borderRadius: normalize(40), // Circular container
        overflow: "hidden", // Ensure the image is contained within the circle
        marginRight: normalize(5), // Increased space between image and text
    },
    profileImage: {
        width: "100%", // Take up the full container width
        height: "100%", // Take up the full container height
        resizeMode: "cover", // Ensure the image fills the circle
    },
    textContainer: {
        flexDirection: "column", // Stack the text vertically
        marginRight: normalize(6),
    },
    username: {
        fontSize: normalize(8),
        fontWeight: "bold",
        color: "rgb(255, 244, 239)",
    },
    hashtag: {
        fontSize: normalize(6),
        color: "rgb(123, 123, 123)",
    },
});

export default ProfileCard;
