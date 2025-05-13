import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
    PixelRatio,
} from 'react-native';
import RequestCard from '../../assets/Profile/RequestCard';

interface PartnerInviteProps {
userID: string;
}

// Normalize helper (moved outside component so styles can access it)
const useNormalize = () => {
const { width } = useWindowDimensions();
return (size: number) => {
    const scale = width / 375;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
};

const PartnerInvite: React.FC<PartnerInviteProps> = ({ userID }) => {
const normalize = useNormalize();

  // Placeholder data
const requestData = [
    { username: "Jane Doe", hashtag: "#janedoe", image: "https://via.placeholder.com/50" },
    { username: "John Smith", hashtag: "#johnsmith", image: "https://via.placeholder.com/50" },
    { username: "Alice Cooper", hashtag: "#alicecooper", image: "https://via.placeholder.com/50" },
];

const dynamicStyles = getStyles(normalize);

return (
    <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.title}>Partner Requests</Text>

        <View style={dynamicStyles.searchRow}>
            <TextInput style={dynamicStyles.input} placeholder="Enter partner username" />
            <TouchableOpacity style={dynamicStyles.button}>
            <Text style={dynamicStyles.buttonText}>Search</Text>
            </TouchableOpacity>
        </View>
        <View style={dynamicStyles.scrollWrapper}>
            <View style={dynamicStyles.left}>
                <Text style={dynamicStyles.subheading}>Pending requests:</Text>
            </View>
            <ScrollView contentContainerStyle={dynamicStyles.cardsContainer}>
                

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
    </View>
    );
};

// Dynamic styles using normalize
const getStyles = (normalize: (size: number) => number) =>
StyleSheet.create({
    left: {
        width: '100%',
        alignItems: 'flex-start',
        marginLeft: normalize(5),
        padding: normalize(3),
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        width: '100%',
    },
    title: {
        fontSize: normalize(7),
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: normalize(2),
        color: '#333',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    input: {
        flex: 0.7,
        height: normalize(15),
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        borderRadius: 25,
        marginRight: normalize(5),
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    button: {
        backgroundColor: '#4CAF50',
        height: normalize(15),
        paddingVertical: normalize(2),
        paddingHorizontal: normalize(4),
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: normalize(6),
        fontWeight: '600',
    },
    subheading: {
        fontSize: normalize(6),
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
        textAlign: 'left',
        textTransform: 'uppercase',
    },
    cardsContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        
        padding: normalize(3),
        
        marginTop: normalize(2),
    },
    scrollWrapper: {
        flex: 1,
        width: '100%',
        height: '5%',
        borderRadius: normalize(15),
        marginTop: normalize(4),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        backgroundColor: '#FFF5EE',
        overflow: 'hidden'
    },

});

export default PartnerInvite;
