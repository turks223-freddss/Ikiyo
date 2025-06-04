import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { HatsIcon } from "../../../assets/images/shopIcons";
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '../../../assets/normalize';
import eventBus from '../utils/eventBus';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 6; 

interface RoomItem {
  id: number;
  item_name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: string;
  allowOverlap: boolean;
  placed: boolean;
  image: any;
}

const FILTERS = [
  { label: "Wallpapers", value: "Wallpapers" },
  { label: "Flooring", value: "Flooring" },
  { label: "Floor Items", value: "Floor Items" },
  { label: "Wall Items", value: "Wall Items" },
];

const Inventory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string>("Wallpapers");

  // Placeholder items for testing (change types to test filtering)
  const [items] = useState<RoomItem[]>([
    { id: 1, item_name: "Classic Wallpaper", type: "Wallpapers", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 2, item_name: "Modern Wallpaper", type: "Wallpapers", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 3, item_name: "Wood Flooring", type: "Wallpapers", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 4, item_name: "Tile Flooring", type: "Wallpapers", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 5, item_name: "Sofa", type: "Wallpapers", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 6, item_name: "Table", type: "Wallpapers", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 7, item_name: "Painting", type: "Wallpapers", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 8, item_name: "Clock", type: "Wall Items", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 9, item_name: "Lamp", type: "Floor Items", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
    { id: 10, item_name: "Shelf", type: "Wall Items", x: 0, y: 0, width: 1, height: 1, state: "new", allowOverlap: false, placed: false, image: HatsIcon },
  ]);

  // Filter logic
  const filteredItems = items.filter(item => item.type === selectedFilter);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  return (
    <View style={styles.inventory}>
      <View style={styles.filter}>
        <View style={styles.outerBorder}>
          <View style={styles.secondBorder}>
            <View style={styles.thirdBorder}>
              <View style={styles.filterBox}>
                {FILTERS.map((filter, idx) => (
                  <TouchableOpacity
                    key={filter.value}
                    style={[
                      styles.filterButton,
                      selectedFilter === filter.value && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedFilter(filter.value)}
                  >
                    <Ionicons
                      name={
                        filter.value === "Wallpapers" ? "image" :
                        filter.value === "Flooring" ? "grid" :
                        filter.value === "Floor Items" ? "cube" :
                        "images"
                      }
                      size={normalize(12)}
                      color={selectedFilter === filter.value ? "#fff" : "#8a6e43"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.view}>
        <View style={styles.gridContainer}>
          {itemsToDisplay.map((item, index) => (
            <TouchableOpacity
              key={item.id + '-' + index}
              style={styles.itemCard}
              onPress={() => eventBus.emit("newItem", item)}
              activeOpacity={0.8}
            >
              <Text style={styles.itemText}>{item.item_name}</Text>
              <Image source={item.image} style={styles.itemImage} />
            </TouchableOpacity>
          ))}
        </View>
        {/* Pagination */}
        <View style={styles.paginationWrapper}>
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.disabledButton,
              ]}
            >
              <Ionicons name="chevron-back" size={normalize(10)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>
              {currentPage} / {totalPages || 1}
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={[
                styles.paginationButton,
                (currentPage === totalPages || totalPages === 0) && styles.disabledButton,
              ]}
            >
              <Ionicons name="chevron-forward" size={normalize(10)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inventory: {
    zIndex: 10,
    flexDirection: 'row',
    position: 'absolute',
    marginLeft: '5%',
    width: '100%',
    height: '100%',
  },
  filter: {
    width: '25%',
    height: '80%',
    marginTop: '15%',
    backgroundColor: 'rgba(255, 200, 200, 0.8)',
  },
  outerBorder: {
    height: '100%',
    borderWidth: normalize(1.7),
    borderColor: '#6b6463',
    backgroundColor: '#6b6463',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1,
  },
  secondBorder: {
    flex: 1,
    borderWidth: normalize(1),
    borderColor: "#a78e63",
    backgroundColor: "#a78e63",
  },
  thirdBorder: {
    flex: 1,
    borderWidth: normalize(1.5),
    borderColor: "#8f7549",
    borderRadius: normalize(1.5),
  },
  filterBox: {
    flex: 1,
    backgroundColor: '#d2a679',
    borderWidth: normalize(1),
    borderColor: '#6b6463',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(2),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  filterButton: {
    width: '90%',
    backgroundColor: '#fff7db',
    borderRadius: normalize(8),
    paddingVertical: normalize(4),
    marginVertical: normalize(2),
    alignItems: 'center',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#8a6e43',
  },
  filterButtonActive: {
    backgroundColor: '#a37b44',
    borderColor: '#a37b44',
  },
  filterButtonText: {
    color: '#8a6e43',
    fontWeight: 'bold',
    fontSize: normalize(4),
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  view: {
    marginTop: '15%',
    height: '80%',
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: normalize(4),
    marginTop: normalize(10),
  },
  itemCard: {
    width: "48%",
    aspectRatio: 2.5,
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    padding: normalize(2),
    marginBottom: normalize(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemImage: {
    width: '60%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: normalize(3),
    color: '#3a2e1f',
    textAlign: 'center',
    marginVertical: normalize(1),
  },
  paginationWrapper: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(4),
    gap: normalize(2),
  },
  paginationButton: {
    backgroundColor: '#a37b44',
    padding: normalize(1),
    borderRadius: normalize(5),
    borderWidth: normalize(1),
    borderColor: '#5e4021',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#aaa',
  },
  pageIndicator: {
    fontSize: normalize(5),
    color: '#3a2e1f',
    fontWeight: 'bold',
    marginHorizontal: normalize(4),
  },
});

export default Inventory;
