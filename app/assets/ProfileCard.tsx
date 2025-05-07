import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";


interface eCardProps {
    imageUri?: string; 
    username?: string; 
    hashtag?: string; 
}

const ProfileCard: React.FC<eCardProps> = ({ imageUri, username, hashtag }) => {
    // Placeholder values
    const placeholderImage = "https://via.placeholder.com/150";
    const placeholderUsername = "Username Here";
    const placeholderHashtag = "#Hashtag"; 

    return (
        <View style={styles.container}>
            {/* Circle for the profile image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUri || placeholderImage }} // Use placeholder if no imageUri provided
                    style={styles.profileImage}
                />
            </View>

            {/* Username and hashtag text */}
            <View style={styles.textContainer}>
                <Text style={styles.username}>{username || placeholderUsername}</Text>
                <Text style={styles.hashtag}>{hashtag || placeholderHashtag}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", // Arrange elements horizontally
        alignItems: "center", // Center vertically
        backgroundColor: "rgba(255, 201, 172, 0.85)", 
        paddingVertical: 10, // reduced from 15
        paddingHorizontal: 10, // reduced from 15
        margin: 10,
        borderRadius: 200, // Rounded corners
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // Shadow effect for elevation on Android
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 30, // Circular container
        overflow: "hidden", // Ensure the image is contained within the circle
        marginRight: 10, // Increased space between image and text
    },
    profileImage: {
        width: "100%", // Take up the full container width
        height: "100%", // Take up the full container height
        resizeMode: "cover", // Ensure the image fills the circle
    },
    textContainer: {
        flexDirection: "column", // Stack the text vertically
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
        color: "rgb(255, 244, 239)",
    },
    hashtag: {
        fontSize: 14,
        color: "rgb(123, 123, 123)",
    },
});

export default ProfileCard;
