import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from "expo-router";
import Room from '../assets/RoomComponents/Room';
import FeatureButton from '../assets/FeatureButton'
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '../../assets/normalize';
import eventBus from '../assets/utils/eventBus';

const RoomMainPage = () => {

  /* 
    NOTE TO DEV:
      Fix the condition `!isInventoryOpen` for the buttons, since it is messy.
  */

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
   useEffect(() => {
    const handleOpenInventory = () => {
      setIsInventoryOpen(true);
    };

    const handleCloseInventory = () => {
      setIsInventoryOpen(false);
    }

    eventBus.on("openInventory", handleOpenInventory);
    eventBus.on("closeInventory", handleCloseInventory);

    return () => {
      eventBus.off("openInventory", handleOpenInventory);
      eventBus.off("closeInventory", handleCloseInventory);
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.room}> 
        <Room/>
      </View>
        <View style={styles.navBar}>
          { !isInventoryOpen && (
          <FeatureButton
              style={styles.button}
              onPress={() => router.push("/school")}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          )}
        </View>
        <View style={styles.toolBar}>
          { !isInventoryOpen && (
            <FeatureButton
              style={styles.button}
              onPress={() => eventBus.emit("openInventory")}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          )}
          { !isInventoryOpen && (
            <FeatureButton
                style={styles.button}
                onPress={() => console.log('yes')}
                icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
                size={normalize(20)}
              />
          )}
          { !isInventoryOpen && (
            <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          )}
          { !isInventoryOpen && (
            <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          )}
          { !isInventoryOpen && (
          <FeatureButton
              style={styles.button}
              onPress={() => console.log('yes')}
              icon={<Ionicons name="megaphone-outline" size={normalize(10)} color="black" />}
              size={normalize(20)}
            />
          )}
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