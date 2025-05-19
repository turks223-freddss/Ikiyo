import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from "expo-router";
import Room from '../assets/RoomComponents/Room';
import FeatureButton from '../assets/FeatureButton'
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '../../assets/normalize';

const RoomMainPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.room}> 
        <Room/>
      </View>
        <View style={styles.navBar}>
          <FeatureButton
              style={styles.button}
              onPress={() => router.push("/school")}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />  
        </View>
        <View style={styles.toolBar}>
          <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1
  },

  navBar: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#00000',
    padding: 30,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  toolBar: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#00000',
    bottom: 0,
    right: 0,
    padding: 30,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  button: {
    margin: 20
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
  },

  room: {
    position: 'absolute',
    height: "100%",
    width: "100%",
    bottom: 0,
    flex: 1,
    backgroundColor: "#ffffff",
  }
});

export default RoomMainPage;