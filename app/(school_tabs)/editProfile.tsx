import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { normalize } from "../../assets/normalize";
import { DailyTaskIcon } from "../../assets/images/TaskIcons";
import { Ionicons } from '@expo/vector-icons';

type InventoryItem = {
  id: string;
  name: string;
  icon: any;
  category: string;
  isPlaceholder?: boolean;
};

const filters = ['All', 'Hats', 'Shirts', 'Pants', 'Shoes'];

const inventoryItems: InventoryItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: i.toString(),
  name: `Item ${i + 1}`,
  icon: DailyTaskIcon,
  category: filters[i % filters.length],
}));

const ITEMS_PER_PAGE = 9;

const InventoryCustomizationOverlay = () => {
  const { width } = useWindowDimensions();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const filteredItems: InventoryItem[] =
    selectedFilter === 'All'
      ? inventoryItems
      : inventoryItems.filter((item) => item.category === selectedFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const lastPageCount = filteredItems.length % ITEMS_PER_PAGE || ITEMS_PER_PAGE;
  const placeholdersNeeded = ITEMS_PER_PAGE - lastPageCount;

  const paginatedItems = filteredItems
    .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
    .concat(
      currentPage === totalPages - 1 && placeholdersNeeded > 0
        ? Array.from({ length: placeholdersNeeded }).map((_, i) => ({
            id: `placeholder-${i}`,
            name: '',
            icon: null,
            category: '',
            isPlaceholder: true,
          }))
        : []
    );

  const handleItemPress = (id: string) => {
    setSelectedItem(id);
    // TODO: trigger avatar update
  };

  const handleBackPress = () => {
    // TODO: Implement back navigation logic
    console.log('Back pressed');
  };

  return (
    <View style={styles.outerContainer}>
      {/* Top bar with back button and title */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={normalize(10)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Avatar</Text>
        <View style={{ width: normalize(30) }} /> {/* placeholder for spacing */}
      </View>

      {/* Main content */}
      <View style={[styles.container, { flexDirection: width < 768 ? 'column' : 'row' }]}>
        {/* Filters on the left */}
        <View style={styles.filterBox}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonSelected,
              ]}
              onPress={() => {
                setSelectedFilter(filter);
                setCurrentPage(0);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextSelected,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Box container for grid + pagination */}
        <View style={styles.gridBox}>
          {/* Item grid */}
          <View style={styles.gridWrapper}>
            <FlatList
              data={paginatedItems}
              numColumns={3}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) =>
                !item.isPlaceholder ? (
                  <TouchableOpacity
                    style={[
                      styles.itemBox,
                      selectedItem === item.id && styles.itemBoxSelected,
                    ]}
                    onPress={() => handleItemPress(item.id)}
                  >
                    <Image source={item.icon} style={styles.itemIcon} />
                    <Text style={styles.itemName}>{item.name}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.itemBox, { opacity: 0 }]} />
                )
              }
            />
          </View>

          {/* Pagination */}
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              <Ionicons name="chevron-back-circle" size={normalize(12)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.pageText}>{`${currentPage + 1} / ${totalPages}`}</Text>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <Ionicons name="chevron-forward-circle" size={normalize(12)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.avatarcontainer}>
              
        </View>
      </View>

        

    </View>

    
  );
};

export default InventoryCustomizationOverlay;

const styles = StyleSheet.create({
    avatarcontainer: {
        backgroundColor: 'white',
        marginHorizontal: normalize(15),
        flex: 3,
    },
  outerContainer: {
    flex: 1,
    backgroundColor: '#1f1f1f',
  },
  topBar: {
    height: normalize(20),
    backgroundColor: '#2a2215',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(10),
  },
  backButton: {
  width: normalize(15),
  height: normalize(15),
  borderRadius: normalize(15),
  backgroundColor: '#3a2e1f', // Optional: give it a background color so the circle is visible
  alignItems: 'center',
  justifyContent: 'center',
},
  title: {
    color: '#fff',
    fontSize: normalize(8),
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    padding: normalize(4),
  },
  filterBox: {
    width: normalize(40),
    marginRight: normalize(10),
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#3a2e1f',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
    borderRadius: normalize(10),
  },
  filterButtonSelected: {
    backgroundColor: '#ecc96b',
  },
  filterText: {
    color: '#fff',
    fontSize: normalize(6),
  },
  filterTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },

  gridBox: {
    flex: 2,
    backgroundColor: '#2a2215',
    borderRadius: normalize(12),
    padding: normalize(8),
    justifyContent: 'space-between', // ✅ add this
},

    gridWrapper: {
    alignItems: 'center',
    flexGrow: 0, // ✅ prevent over-expansion
},

  grid: {
    justifyContent: 'center',
  },
  itemBox: {
    backgroundColor: '#3a2e1f',
    borderRadius: normalize(4),
    alignItems: 'center',
    justifyContent: 'center',
    margin: normalize(6),
    width: normalize(20),
    height: normalize(20),
  },
  itemBoxSelected: {
    backgroundColor: '#ecc96b',
  },
  itemIcon: {
    width: normalize(15),
    height: normalize(15),
  },
  itemName: {
    fontSize: normalize(3.5),
    color: '#fff',
  },
  pagination: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: normalize(10),
  marginTop: normalize(6),
  marginBottom: normalize(6), // ✅ optional for spacing
},

  pageText: {
    color: '#fff',
    fontSize: normalize(5),
  },
});
