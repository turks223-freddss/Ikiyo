import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image,Alert, } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");

interface Item {
  item_id: number;
  item_name: string;
  image: string;
  price: number;
  category: string;
  part: string | null;
}

interface UserData {
  userID: number;
  username: string;
  email: string;
  password: string;
  gold: number;
  ruby: number;
  description: string | null;
}



const ShopScreen = () => {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]); // Store fetched items
  const [filteredItems, setFilteredItems] = useState(items);
  const [user, setUser] = useState<{
    userID: number;
  } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [ownedItems, setOwnedItems] = useState<number[]>([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (typeof parsedUser === "number") {
            setUser({ userID: parsedUser }); // Convert number to object
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
    if (!user || !user.userID) return; // Prevent empty request
    console.log("Current user:", user); // Debugging step
    
    fetch("http://192.168.164.231:8081/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID:user.userID }),
    })

    .then(async (response) => {
      const text = await response.text(); // Read raw response
      console.log("Raw response:", text);
      return JSON.parse(text);
    })

    .then((data) => {
      console.log("Fetched user data:", data);
      setUserData(data);
    })

      .catch((error) => console.error("Error fetching user data:", error));
    
  }, [user]); // Runs when `user` changes


  // Fetch items from API
  useEffect(() => {
    fetch("http://192.168.164.231:8081/api/items") // Replace with your actual API URL
      .then((response) => response.json())
      .then((data) => {
        setItems(data); // Set items from API
        setFilteredItems(data); // Set initial filtered items
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, []);


  const fetchUserInventory = () => {
    if (!user || !user.userID) return;
  
    fetch("http://192.168.164.231:8081/api/user-inventory/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: user.userID }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched inventory:", data);
        setOwnedItems(data.owned_items);
      })
      .catch((error) => console.error("Error fetching user inventory:", error));
  };

  useEffect(() => {
    fetchUserInventory();
  }, [user]);

  const filterByCategory = (category: string) => {
    setFilteredItems(items.filter((item) => item.category.toLowerCase() === category.toLowerCase()));
  };
  
  const filterByPart = (part: string) => {
    setFilteredItems(items.filter((item) => item.category.toLowerCase() === "accessories" && item.part?.toLowerCase() === part.toLowerCase()));
  };

  const buyItem = async (item: Item) => {
    if (!user) {
      Alert.alert("Error", "User not found.");
      return;
    }

    try {
      const response = await fetch("http://192.168.164.231:8081/api/buy-item/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.userID,
          item_id: item.item_id,
          price: item.price,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", result.message);
        if (userData) {
          setUserData((prevUserData) =>
            prevUserData ? { ...prevUserData, gold: prevUserData.gold - item.price } : prevUserData
          );
        }
        fetchUserInventory();
      } else {
        Alert.alert("Purchase Failed", result.detail);
      }
    } catch (error) {
      console.error("Error purchasing item:", error);
      Alert.alert("Error", "Failed to process the request.");
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.topButtonContainer}>
        <TouchableOpacity style={styles.buttonT} onPress={() => filterByPart("head")}>
          <Text style={styles.buttonText}>Head</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonT} onPress={() => filterByPart("hat")}>
          <Text style={styles.buttonText}>Hat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonT} onPress={() => filterByPart("body")}>
          <Text style={styles.buttonText}>Body</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonT} onPress={() => filterByPart("torso")}>
          <Text style={styles.buttonText}>Torso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonT} onPress={() => filterByPart("shoes")}>
          <Text style={styles.buttonText}>Shoes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {/* Category Filter */}
        <TouchableOpacity style={styles.button} onPress={() => filterByCategory("accessories")}>
          <Text style={styles.buttonText}>Accessories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => filterByCategory("furniture")}>
          <Text style={styles.buttonText}>Furniture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.shopContainer}>
      <FlatList
        data={filteredItems}
        horizontal
        keyExtractor={(item) => item.item_id.toString()}
        renderItem={({ item }) => {
          const isOwned = ownedItems.includes(item.item_id) && item.category.toLowerCase() === "accessories";

          return (
            <View style={styles.itemBox}>
              <Text style={styles.itemText}>{item.item_name}</Text>

              {/* Display Image */}
              <Image source={{ uri: item.image }} style={styles.itemImage} />

              {/* Purchase Button */}
              <TouchableOpacity
                style={[styles.priceTag, isOwned && styles.ownedTag]} 
                onPress={() => !isOwned && buyItem(item)} 
                disabled={isOwned} 
              >
                <Text style={styles.priceText}>{isOwned ? "Owned" : item.price}</Text>
              </TouchableOpacity>
            </View>
          );
  }}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.scrollContainer}
/>
      </View>
      <View style={styles.container}>
    {/* Existing UI components */}

    {/* Floating Back Button */}
    <TouchableOpacity style={styles.floatingButton} onPress={() => router.push("/")}>
      <Text style={styles.floatingButtonText}>←</Text>
    </TouchableOpacity>
    <View style={styles.gold_container}>
      <Text style={styles.gold_container_text}>{userData?.gold}</Text>

    </View>
  </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4B5",
  },
  topButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 0,
    top:'5%',
    gap:50,
  },
  buttonContainer: {
    flexDirection: "column",
    position: "absolute",
    left: "0.1%",
    height:'50%'
  },
  button: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    top:'1%',
    height:'50%',
    
  },
  buttonT: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    top:'15%'
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  shopContainer: {
    width: "80%",
    height: "80%",
    backgroundColor: "#FF5A5F",
    borderRadius: 20,
    overflow: "hidden",
    padding: 10,
  },
  scrollContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  itemBox: {
    width: width * 0.20,
    height: 120,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  itemImage: {
    width: 60,
    height: 60,
  
  },
  priceTag: {
    marginTop: 5,
    backgroundColor: "gold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  priceText: {
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: "-48%",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  gold_container:{
    height:40,
    width:100,
    backgroundColor:"gold",
    position:"absolute",
    right:"-48%",
    top:-335,
    zIndex:9999,
    justifyContent:"center",
    alignItems:"center"
  },
  gold_container_text:{
    color: "black",
    fontSize: 24,
    fontWeight: "bold"
  },

  ownedTag: {
    backgroundColor: "gray",
  },

});

export default ShopScreen;
