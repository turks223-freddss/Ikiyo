import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

interface Item {
  item_id: number;
  item_name: string;
  image: string;
  price: number;
  category: string;
  part: string | null;
}

type User = {
  userID: number;
};

export default function Edit() {
  
  const router = useRouter();

  const [furnitureItems, setFurnitureItems] = useState<Item[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (typeof parsedUser === "number") {
            setUser({ userID: parsedUser });
          } else {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFurnitureItems = async () => {
      try {
        const response = await fetch("http://192.168.164.231:8081/api/display-inventory-room/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: user?.userID }),
        });

        const data = await response.json();
        setFurnitureItems(data.furniture_items || []);
      } catch (error) {
        console.error("Error fetching room inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userID) {
      fetchFurnitureItems();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.Main_container}>
        
        <View style={styles.room_container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
        </View>


        <View style={styles.inventory_container}>
          <FlatList
            data={furnitureItems}
            horizontal
            keyExtractor={(item, index) => `${item.item_id}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.itemBox}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.item_name}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  Main_container:{
    flexDirection:'column',
    flex: 1,
    width:'100%',
    padding:10,
    gap: 7,
    backgroundColor:'rgb(0, 151, 3)'
  },
  room_container:{
    height:'70%',
    width:'100%',
    backgroundColor:'rgb(196, 248, 197)',
    
  },

  inventory_container:{
    height:'30%',
    width:'100%',
    backgroundColor:'rgb(2, 83, 4)'
  },

  scrollContainer: {
    paddingHorizontal: 5,
  },
  itemBox: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor:'rgb(151, 221, 153)',
    padding:6
  },
  itemImage: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 8,
  },
  itemName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
  },

  backButton:{
    position:'absolute',
    top:'3%',
    right:'5%',
    width:'auto',
    height:'auto',
  },

})