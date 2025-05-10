import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';

const Settings = () => {
const [soundVolume, setSoundVolume] = useState(0.5);
const [musicVolume, setMusicVolume] = useState(0.5);
const [connectedAccounts, setConnectedAccounts] = useState({
    googlePlay: true,
    gmail: true,
    facebook: false,
});

return (
        <View style={styles.screen}>
            <Text style={styles.header}>Settings</Text>

            {/* Preferences and Connected Accounts side by side */}
            <View style={styles.row}>
                {/* Preferences Card */}
                <View style={[styles.card, styles.cardLeft]}>
                <Text style={styles.cardTitle}>Preferences</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Language</Text>
                    <TouchableOpacity style={styles.languageButton}>
                    <Text style={styles.languageText}>English ▾</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Sound Volume</Text>
                    <Slider
                    style={styles.slider}
                    value={soundVolume}
                    onValueChange={setSoundVolume}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    minimumTrackTintColor="#4CAF50"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#4CAF50"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Music Volume</Text>
                    <Slider
                    style={styles.slider}
                    value={musicVolume}
                    onValueChange={setMusicVolume}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    minimumTrackTintColor="#2196F3"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#2196F3"
                    />
                </View>
                </View>

                {/* Connected Accounts Card */}
                <View style={[styles.card, styles.cardRight]}>
                <Text style={styles.cardTitle}>Connected Accounts</Text>
                {Object.entries(connectedAccounts).map(([platform, isConnected]) => (
                    <View key={platform} style={styles.accountRow}>
                    <Text style={styles.accountLabel}>
                        {platform.replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <Switch
                        value={isConnected}
                        onValueChange={(value) =>
                        setConnectedAccounts((prev) => ({
                            ...prev,
                            [platform]: value,
                        }))
                        }
                    />
                    </View>
                ))}
                </View>
            </View>

            {/* Buttons Row */}
            <View style={styles.rowButtons}>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                <Text style={styles.secondaryText}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.logoutButton]}>
                <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFF5EE',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        width: '100%',
    },
    header: {
        fontSize: 32, // Increased font size
        fontWeight: '700',
        marginBottom: 40, // Increased margin
        textAlign: 'center',
        color: '#333',
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 900,  // Adjust the max width as necessary
        marginBottom: 40, // Increased margin
        paddingHorizontal: 10, // Ensures no extra space around the row
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16, // Slightly increased border radius
        padding: 24, // Increased padding inside the card
        marginBottom: 30, // Increased margin
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6, // Slightly increased shadow radius
    },
    cardLeft: {
        width: '48%', // Card on the left side
    },
    cardRight: {
        width: '48%', // Card on the right side
    },
    cardTitle: {
        fontSize: 22, // Increased font size
        fontWeight: '700',
        marginBottom: 24, // Increased margin
        color: '#333',
    },
    section: {
        marginBottom: 24, // Increased margin between sections
    },
    label: {
        fontSize: 18, // Increased font size
        fontWeight: '600',
        marginBottom: 12, // Increased margin
        color: '#444',
    },
    languageButton: {
        backgroundColor: '#f1f1f1',
        paddingVertical: 14, // Increased padding
        paddingHorizontal: 22, // Increased padding
        borderRadius: 12, // Slightly increased border radius
        borderWidth: 1,
        borderColor: '#ccc',
    },
    languageText: {
        fontSize: 18, // Increased font size
        color: '#333',
    },
    slider: {
        width: '100%',
        height: 48, // Increased height for better visibility
    },
    accountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12, // Increased margin
        paddingHorizontal: 12, // Increased padding
        paddingVertical: 14, // Increased padding
        backgroundColor: '#f8f8f8',
        borderRadius: 10, // Increased border radius
    },
    accountLabel: {
        fontSize: 18, // Increased font size
        color: '#333',
        textTransform: 'capitalize',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 18, // Increased gap between buttons
        width: '100%',
        paddingHorizontal: 12,
    },
    button: {
        paddingVertical: 16, // Increased padding
        borderRadius: 14, // Increased border radius
        alignItems: 'center',
        minWidth: 180, // Increased min width for better button size
    },
    secondaryButton: {
        backgroundColor: '#e0e0e0',
    },
    secondaryText: {
        fontSize: 18, // Increased font size
        fontWeight: '500',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#ff5252',
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18, // Increased font size
    },
});

export default Settings;
