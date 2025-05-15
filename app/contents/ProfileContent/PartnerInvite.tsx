import eventBus from "../../assets/utils/eventBus"
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
    PixelRatio,
    ActivityIndicator,
    Alert
} from 'react-native';
import RequestCard from '../../assets/Profile/RequestCard';

interface PartnerInviteProps {
    userID: number;
}

interface Request {
    id: number;
    from_user_id: number;
    from_username: string;
    timestamp: string;
    accepted: boolean;
}

// Normalize helper
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
    const dynamicStyles = getStyles(normalize);

    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchInput, setSearchInput] = useState('');
    const [searchedUser, setSearchedUser] = useState<{
    userID: number;
    username: string;
    buddy_id: number | null;
    } | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    
    const fetchRequests = async () => {
        try {
            const response = await fetch('http://192.168.1.5:8081/api/buddy/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'list',
                    user_id: userID,
                }),
            });

            const data = await response.json();
            setRequests(data.pending_requests || []);
        } catch (err) {
            setError('Failed to fetch requests.');
        } finally {
            setLoading(false);
        }
    };
    const handleAction = async (action: "accept" | "decline"|"send_request", target_id: number) => {
        try {
            const response = await fetch("http://192.168.1.5:8081/api/buddy/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: action,
                    user_id: userID,
                    target_id: target_id,
                }),
            });
            const data = await response.json();
            Alert.alert(data.message || `${action}ed successfully`);
            
            fetchRequests(); // Refresh list

        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
        }
    };

    const handleSearch = async () => {
        if (!searchInput.trim()) {
            // Clear search results if input is empty
            setSearchedUser(null);
            setSearchError(null);
            return;
        }

        setSearchLoading(true);
        setSearchError(null);
        setSearchedUser(null);

        // Detect if input is a number (userID) or a string (username)
        const isNumber = /^\d+$/.test(searchInput.trim());

        const bodyPayload = {
            action: 'search',
            ...(isNumber ? { target_id: Number(searchInput.trim()) } : { username: searchInput.trim() }),
        };

        try {
            const response = await fetch('http://192.168.1.5:8081/api/buddy/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload),
            });

            const data = await response.json();

            if (response.ok) {
            setSearchedUser(data.user);
            } else {
            setSearchError(data.error || 'User not found.');
            }
        } catch (err) {
            setSearchError('Failed to perform search.');
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);
     

    return (
        <View style={dynamicStyles.container}>
            <Text style={dynamicStyles.title}>Partner Requests</Text>

            <View style={dynamicStyles.searchRow}>
                <TextInput 
                style={dynamicStyles.input} 
                placeholder="Enter partner username or ID"
                value={searchInput} 
                onChangeText={setSearchInput}
                keyboardType="default"
                autoCapitalize="none"
                />
                <TouchableOpacity style={dynamicStyles.button} onPress={handleSearch}>
                    <Text style={dynamicStyles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>

            <View style={dynamicStyles.scrollWrapper}>
                <View style={dynamicStyles.left}>
                    <Text style={dynamicStyles.subheading}>
                        {searchedUser ? "Searched User" : "Pending requests:"}
                    </Text>
                </View>

                {searchLoading ? (
                    <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
                ) : searchError ? (
                    <Text style={{ color: 'red', padding: 10 }}>{error}</Text>
                ) : searchedUser ? (
                    <View style={dynamicStyles.left}>
                    <RequestCard
                        key={searchedUser.userID}
                        username={searchedUser.username}
                        hashtag={`#${searchedUser.userID}`}
                        image="https://via.placeholder.com/50"
                        onAccept={() => Alert.alert('Accept not applicable here')}
                        onReject={() => Alert.alert('Reject not applicable here')}
                        variant={2}
                        onSendRequest={() => {handleAction("send_request",searchedUser.userID)}}
                    />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={dynamicStyles.cardsContainer}>
                        {requests.map((request) => (
                            <RequestCard
                                key={request.id}
                                username={request.from_username}
                                hashtag={`#${request.from_user_id}`}
                                image="https://via.placeholder.com/50" // Replace with user image if available
                                onAccept={() => {handleAction("accept", request.from_user_id);
                                    eventBus.emit("buddyUpdate");}
                                }
                                onReject={() => handleAction("decline", request.from_user_id)}
                            />
                        ))}
                    </ScrollView>
                )}
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
