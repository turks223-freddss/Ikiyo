import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";


const { width } = Dimensions.get("window");

const items = [
  { id: 1, name: "Sword", price: 200 },
  { id: 2, name: "Shield", price: 300 },
  { id: 3, name: "Potion", price: 150 },
  { id: 4, name: "Helmet", price: 250 },
  { id: 5, name: "Boots", price: 180 },
  { id: 6, name: "Armor", price: 500 },
  { id: 7, name: "Ring", price: 100 },
  { id: 8, name: "Bow", price: 350 },
  { id: 9, name: "haha", price: 39 },
  { id: 10, name: "please work", price: 350 },
  { id: 11, name: "sigi na", price: 350 },
  { id: 12, name: "bahala ka", price: 350 },
  { id: 13, name: "yowhelp", price: 350 },
  { id: 14, name: "amazinbg", price: 350 },
];

const ShopScreen = () => {
  const router = useRouter();
  
  const [filteredItems, setFilteredItems] = useState(items);

  const filterItems = (divisor:number) => {
    if (divisor === 0) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.id % divisor === 0));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtonContainer}>
        {[0, 2, 3, 4, 5, 6, 7].map((num) => (
          <TouchableOpacity key={num} style={styles.button} onPress={() => filterItems(num)}>
            <Text style={styles.buttonText}>{num === 0 ? "Reset" : `Divisible by ${num}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setFilteredItems(items.filter((item) => item.id % 2 === 0))}>
          <Text style={styles.buttonText}>Accessories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setFilteredItems(items.filter((item) => item.id % 2 !== 0))}>
          <Text style={styles.buttonText}>Furniture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.shopContainer}>
        <FlatList
          data={filteredItems}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemBox}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
            </View>
          )}
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
  },
  buttonContainer: {
    flexDirection: "column",
    position: "absolute",
    left: "0.5%",
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

});

export default ShopScreen;
