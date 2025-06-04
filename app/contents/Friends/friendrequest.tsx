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

interface FriendRequestProps {
    userID?: number;
}

interface Request {
    request_id: number;
    from_user_id: number;
    from_username: string;
    created_at: string;
    
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

const FriendRequest: React.FC<FriendRequestProps> = ({ userID }) => {
    const normalize = useNormalize();
    const dynamicStyles = getStyles(normalize);
    const [requests, setRequests] = useState<Request[]>([]);

    const [searchInput, setSearchInput] = useState('');
    const [searchedUser, setSearchedUser] = useState<{
    userID: number;
    username: string;
    buddy_id: number | null;
    } | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

  // Placeholder data
// const requestData = [
//     { username: "Jane Doe", hashtag: "#janedoe", image: "https://via.placeholder.com/50" },
//     { username: "John Smith", hashtag: "#johnsmith", image: "https://via.placeholder.com/50" },
//     { username: "Alice Cooper", hashtag: "#alicecooper", image: "https://via.placeholder.com/50" },
// ];

const fetchRequests = async () => {
        try {
            const response = await fetch('http://192.168.1.5:8081/api/friend-action/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'view_friend_requests',
                    userID: userID,
                }),
            });

            const data = await response.json();
            setRequests(data.friend_requests || []);
        } catch (err) {
            setError('Failed to fetch requests.');
        } finally {
            setLoading(false);
        }
    };
const handleAction = async (action: "accept_friend" | "decline_friend", target_id: number) => {
        try {
            const response = await fetch("http://192.168.1.5:8081/api/friend-action/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: action,
                    userID: userID,
                    request_id: target_id,
                }),
            });
            const data = await response.json();
            Alert.alert(data.message || `${action}ed successfully`);
            
            fetchRequests(); // Refresh list

        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
        }
    };

const searchUser = async () => {
    if (!searchInput.trim()) {
        Alert.alert("Please enter a username or ID to search.");
        return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setSearchedUser(null);

    try {
        const response = await fetch("http://192.168.1.5:8081/api/friend-action/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "search_user",
                userID: userID,
                query: searchInput,
            }),
        });

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // Show only the first user found for simplicity
            setSearchedUser({
                userID: data.results[0].userID,
                username: data.results[0].username,
                buddy_id: null,
            });
        } else {
            setSearchError("No users found.");
        }

    } catch (err) {
        console.error("Search failed:", err);
        setSearchError("Search failed. Please try again.");
    } finally {
        setSearchLoading(false);
    }
};

const sendRequest = async (toUserID: number) => {
    try {
        const response = await fetch("http://192.168.1.5:8081/api/friend-action/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "add_friend",
                userID: userID,
                to_user_id: toUserID,
            }),
        });

        const data = await response.json();
        Alert.alert(data.message || "Friend request sent.");
    } catch (err) {
        Alert.alert("Failed to send request.");
    }
};
    
useEffect(() => {
  if (userID !== undefined) {
    fetchRequests();
  }
}, [userID]);

return (
    <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.title}>Friend Request</Text>

        <View style={dynamicStyles.searchRow}>
            <TextInput 
                style={dynamicStyles.input} 
                placeholder="Enter username or ID" 
                value={searchInput}
                onChangeText={setSearchInput}
                keyboardType="default"
                autoCapitalize="none"
            />
            <TouchableOpacity style={dynamicStyles.button} onPress={searchUser}>
                <Text style={dynamicStyles.buttonText} >
                    Search
                </Text>
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
                        onSendRequest={() => sendRequest(searchedUser.userID)}
                    />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={dynamicStyles.cardsContainer}>
                        {requests.length === 0 ? (
                            <Text style={{ padding: 10, color: 'gray' }}>No pending friend requests.</Text>
                            ) : (
                            requests.map((request) => (
                                <RequestCard
                                key={request.request_id}
                                username={request.from_username}
                                hashtag={`#${request.from_user_id}`}
                                image="https://via.placeholder.com/50"
                                onAccept={() => {
                                    handleAction("accept_friend", request.request_id);
                                    eventBus.emit("buddyUpdate");
                                    eventBus.emit("refreshHome");
                                }}
                                onReject={() => handleAction("decline_friend", request.request_id)}
                                />
                            ))
                            )}
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
        borderTopLeftRadius: normalize(15),
        borderTopRightRadius: normalize(15),
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

export default FriendRequest;
