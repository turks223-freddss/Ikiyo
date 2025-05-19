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
const screenWidth = Dimensions.get('window').width;

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

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
    if (!user) return;

    const fetchItems = async () => {
      try {
        console.log("Fetching inventory for userID:", user.userID);
        const response = await fetch('http://192.168.1.5:8081/api/display-inventory-avatar/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: user.userID }),
        });
    
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
    
        const data = await response.json();
        setItems(data.accessories_items);
        setFilteredItems(data.accessories_items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  const filterByPart = (part: string | null) => {
    setSelectedPart(part);
    if (part === null) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => item.part === part);
      setFilteredItems(filtered);
    }
  };



  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.text}>{item.item_name}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex:1, justifyContent: "center", alignItems: "center", }}>
      <View
      style={{ flex:1,
      backgroundColor:'rgb(250, 231, 212)',
      flexDirection:'row',
      padding: 4,
      gap:7

      }}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <View style={styles.container}>
        
          {/* Inventory Grid */}
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={item => item.item_id.toString()}
            numColumns={3}
            
            contentContainerStyle={{ gap:12}}
          />

          {/* Filter buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity onPress={() => filterByPart(null)} style={styles.filterBtn}>
              <Text>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterByPart("hat")} style={styles.filterBtn}>
              <Text>Hats</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterByPart("shoes")} style={styles.filterBtn}>
              <Text>Shoes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterByPart("head")} style={styles.filterBtn}>
              <Text>head</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterByPart("body")} style={styles.filterBtn}>
              <Text>body</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterByPart("torso")} style={styles.filterBtn}>
              <Text>torso</Text>
            </TouchableOpacity>
          </View>
        </View>
        

        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={250} color="black" />
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width: '50%',
    padding:12,
    backgroundColor: 'rgb(245, 210, 177)',
    flexDirection:"row",
    borderRadius:20,

  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f0f0f0',
    flex:1/3,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    margin: 6,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  filterBtn: {
    backgroundColor: 'rgb(247, 178, 113)',
    paddingHorizontal: 12,
    // paddingVertical: 6,
    borderRadius: 20,
    height:"13%"
  },

  avatarContainer:{
    width:'50%',
    alignItems:'center',
    justifyContent:'center'
  },
  backButton:{
    position:'absolute',
    top:'3%',
    right:'5%',
    width:'auto',
    height:'auto',
  },

});