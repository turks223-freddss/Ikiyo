import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';
import Slider from '@react-native-community/slider';

const useNormalize = () => {
  const { width } = useWindowDimensions();
  const BASE_WIDTH = 1920; // Designed for larger screens

  return (size: number) => {
    const scale = width / BASE_WIDTH;
    const newSize = size * scale;
    const normalizedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));

    return normalizedSize;
  };
};

const Settings = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1200;
  const normalize = useNormalize();

  const [soundVolume, setSoundVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [connectedAccounts, setConnectedAccounts] = useState({
    googlePlay: true,
    gmail: true,
    facebook: false,
  });

  const styles = getStyles(normalize, isSmallScreen);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.row}>
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

const getStyles = (normalize: (size: number) => number, isSmallScreen: boolean) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#FFF5EE',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: normalize(12),
      width: '100%',
    },
    header: {
      fontSize: normalize(32),
      marginBottom: normalize(15),
      fontWeight: '700',
      textAlign: 'center',
      color: '#333',
      textTransform: 'uppercase',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: normalize(900),
      paddingHorizontal: normalize(10),
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: normalize(16),
      padding: normalize(24),
      marginBottom: normalize(15),
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: normalize(6),
    },
    cardLeft: {
      width: '48%',
    },
    cardRight: {
      width: '48%',
    },
    cardTitle: {
      fontSize: normalize(22),
      fontWeight: '700',
      marginBottom: normalize(24),
      color: '#333',
    },
    section: {
      marginBottom: normalize(24),
    },
    label: {
      fontSize: normalize(18),
      fontWeight: '600',
      marginBottom: normalize(12),
      color: '#444',
    },
    languageButton: {
      backgroundColor: '#f1f1f1',
      paddingVertical: normalize(14),
      paddingHorizontal: normalize(22),
      borderRadius: normalize(12),
      borderWidth: 1,
      borderColor: '#ccc',
    },
    languageText: {
      fontSize: normalize(18),
      color: '#333',
    },
    slider: {
      width: '100%',
      height: normalize(48),
    },
    accountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: normalize(2),
      paddingHorizontal: normalize(12),
      paddingVertical: normalize(4),
      backgroundColor: '#f8f8f8',
      borderRadius: normalize(10),
    },
    accountLabel: {
      fontSize: normalize(18),
      color: '#333',
      textTransform: 'capitalize',
    },
    rowButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: normalize(18),
      width: '100%',
      paddingHorizontal: normalize(12),
    },
    button: {
      paddingVertical: normalize(16),
      borderRadius: normalize(14),
      alignItems: 'center',
      minWidth: normalize(180),
    },
    secondaryButton: {
      backgroundColor: '#e0e0e0',
    },
    secondaryText: {
      fontSize: normalize(18),
      fontWeight: '500',
      color: '#333',
    },
    logoutButton: {
      backgroundColor: '#ff5252',
    },
    logoutText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: normalize(18),
    },
  });

export default Settings;
