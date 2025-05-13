import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    PixelRatio,
} from 'react-native';

interface RequestCardProps {
    username?: string;
    hashtag?: string;
    image?: any;
    onAccept?: () => void;
    onReject?: () => void;
}

const useNormalize = () => {
const { width } = useWindowDimensions();
  const scale = width / 375; // iPhone 11 base
  return (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

const RequestCard: React.FC<RequestCardProps> = ({
    username = 'John Doe',
    hashtag = '#example_hashtag',
    image = 'https://via.placeholder.com/50',
    onAccept = () => {},
    onReject = () => {},
}) => {
const normalize = useNormalize();
const styles = getStyles(normalize);

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

const getStyles = (normalize: (size: number) => number) =>
StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        backgroundColor: '#fff',
        padding: normalize(2),
        borderRadius: normalize(15),
        marginBottom: normalize(2),
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: normalize(20),
        height: normalize(20),
        borderRadius: normalize(25),
        borderWidth: 2,
        borderColor: '#ddd',
        marginRight: normalize(12),
    },
    textContainer: {
        justifyContent: 'center',
    },
    username: {
        fontSize: normalize(8),
        fontWeight: '700',
        color: '#333',
    },
    hashtag: {
        fontSize: normalize(5),
        color: '#555',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: normalize(4),
        paddingHorizontal: normalize(8),
        borderRadius: normalize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        marginRight: normalize(2),
    },
    rejectButton: {
        backgroundColor: '#FF5733',
        marginRight: normalize(4),
    },
    buttonText: {
        color: '#fff',
        fontSize: normalize(5),
        fontWeight: '600',
    },
});

export default RequestCard;
