import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface RequestCardProps {
    username?: string;
    hashtag?: string;
    image?: any;
    onAccept?: () => void;
    onReject?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
    username = "John Doe",
    hashtag = "#example_hashtag",
    image = "https://via.placeholder.com/50",
    onAccept = () => {},
    onReject = () => {},
}) => {
return (
    <View style={styles.cardContainer}>
        <View style={styles.leftContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.textContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.hashtag}>{hashtag}</Text>
            </View>
        </View>
        <View style={styles.rightContainer}>
            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
            <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={onReject}>
            <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
        </View>
    </View>
);
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '85%', // Adjusted width for better balance
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 5, // Subtle shadow for a modern look
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }, // Subtle offset for depth
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 55,
        height: 55,
        borderRadius: 27.5, // Ensures the image remains circular
        borderWidth: 3,
        borderColor: '#ddd', // Subtle border color
        marginRight: 15,
        alignSelf: 'center',
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    username: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    hashtag: {
        fontSize: 14,
        color: '#555',
    },
    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        width: 100, // Ensures consistent button width
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#4CAF50', // Green for accept
        marginRight: 15, // Space between accept and reject
    },
    rejectButton: {
        backgroundColor: '#FF5733', // Red for reject
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RequestCard;
