import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageSourcePropType,
    Button,
} from 'react-native';

type MyJournalTaskCardProps = {
    questImage: ImageSourcePropType;
    titleName: string;
    rewardImage: ImageSourcePropType;
    reward?: number;
    onPress: () => void;
};

const MyJournalTaskCard: React.FC<MyJournalTaskCardProps> = ({
    questImage,
    titleName,
    rewardImage,
    reward,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        <Image source={questImage} style={styles.icon} />
        
        <View style={styles.middleContainer}>
            <Text style={styles.cardTitle}>{titleName}</Text>
            <View style={styles.rewardRow}>
            <Image source={rewardImage} style={styles.rewardIcon} />
            <Text style={styles.reward}>{reward}</Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <Button title="Claim Rewards" onPress={() => {}} />
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    icon: {
        width: 50,
        height: 50,
        marginRight: 12,
        borderRadius: 6,
        resizeMode: 'contain',
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    rewardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    reward: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        marginLeft: 8,
    },
});

export default MyJournalTaskCard;
