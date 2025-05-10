import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RequestCard from '../../assets/Profile/RequestCard';  // Assuming you have the RequestCard component created earlier

interface PartnerInviteProps {
    userID: string;
}

const PartnerInvite: React.FC<PartnerInviteProps> = ({ userID }) => {
  // Placeholder data for cards
const requestData = [
    { username: "Jane Doe", hashtag: "#janedoe", image: "https://via.placeholder.com/50" },
    { username: "John Smith", hashtag: "#johnsmith", image: "https://via.placeholder.com/50" },
    { username: "Alice Cooper", hashtag: "#alicecooper", image: "https://via.placeholder.com/50" },
];

return (
    <View style={styles.container}>
        <Text style={styles.title}>Partner Requests</Text>

        <View style={styles.searchRow}>
            <TextInput
            style={styles.input}
            placeholder="Enter partner username"
            />
            <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
        </View>

        {/* Cards container with Pending requests label inside */}
        <ScrollView contentContainerStyle={styles.cardsContainer}>
            {/* Aligning "Pending requests" text to the left */}
            <View style={styles.left}>
            <Text style={styles.subheading}>Pending requests:</Text>
            </View>
            
            {requestData.map((request, index) => (
            <RequestCard
                key={index}
                username={request.username}
                hashtag={request.hashtag}
                image={request.image}
            />
            ))}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    left: {
        width: '100%',
        alignItems: 'flex-start', // Align the text to the left
        marginBottom: 15, // Add space between the label and cards
        paddingLeft: 10, // Optional padding for better alignment
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'center',
        width: '100%',
    },
    input: {
        flex: 0.7,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 15,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    subheading: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        textAlign: 'left', // Align the label text to the left
        textTransform: 'uppercase',
    },
    cardsContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#FFF5EE', // Light contrasting background
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        marginTop: 20,
    },

});

export default PartnerInvite;
