import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { normalize } from "../../assets/normalize";
import { DailyTaskIcon } from "../../assets/images/TaskIcons";
import { Ionicons } from '@expo/vector-icons';
import { ShopBackground, FaceExIcon, FaceAccIcon, HatsIcon, ShoesIcon, LowerIcon, EyesIcon, UpperIcon} from "../../assets/images/shopIcons"

type InventoryItem = {
  id: string;
  name: string;
  icon: any;
  category: string;
  isPlaceholder?: boolean;
};

const filters = [
  { label: 'All', icon: HatsIcon},
  { label: 'Hats', icon: HatsIcon },
  { label: 'Eyes', icon: EyesIcon },
  { label: 'Face Accessories', icon: FaceAccIcon },
  { label: 'Face Expression', icon: FaceExIcon },
  { label: 'Upper', icon: UpperIcon },
  { label: 'Lower', icon: LowerIcon },
  { label: 'Shoes', icon: ShoesIcon },
];

const inventoryItems: InventoryItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: i.toString(),
  name: `Item ${i + 1}`,
  icon: DailyTaskIcon,
  category: filters[i % filters.length].label,
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
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={normalize(10)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Avatar</Text>
        <View style={{ width: normalize(30) }} />
      </View>

      {/* Main content */}
      <View style={[styles.container, { flexDirection: width < 768 ? 'column' : 'row' }]}>
        {/* Filter area */}
        <View style={styles.outerBorder}>
          <View style={styles.secondBorder}>
            <View style={styles.thirdBorder}>
              <View style={styles.filterBox}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                  {filters.map(({ label, icon }) => (
                    <TouchableOpacity
                      key={label}
                      style={[
                        styles.filterButton,
                        selectedFilter === label && styles.filterButtonSelected,
                      ]}
                      onPress={() => {
                        setSelectedFilter(label);
                        setCurrentPage(0);
                      }}
                    >
                      <Image source={icon} style={styles.filterIconImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>

        {/* Grid + Pagination */}
        <View style={styles.gridBox}>
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
              <Ionicons name="chevron-back-circle" size={normalize(12)} color="#a37b44" />
            </TouchableOpacity>
            <Text style={styles.pageText}>{`${currentPage + 1} / ${totalPages}`}</Text>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <Ionicons name="chevron-forward-circle" size={normalize(12)} color="#a37b44" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar Display Placeholder */}
        <View style={styles.avatarcontainer} />
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
    backgroundColor: '#3a2e1f',
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
  outerBorder: {
    flex: .6,
    borderRadius: normalize(3),
    borderWidth: normalize(1.7),
    borderColor: '#6b6463',
    backgroundColor: '#6b6463',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginLeft: normalize(15),
    marginVertical: normalize(15),
    zIndex:1,
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
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  filterScroll: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: normalize(5),
  },
  filterButton: {
    padding: normalize(4),
    backgroundColor: '#cdb892',
    borderRadius: normalize(6),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#ecc96b',
  },
  filterIconImage: {
    width: normalize(12),
    height: normalize(12),
    resizeMode: 'contain',
  },
  gridBox: {
    flex: 2,
    backgroundColor: '#fff7db',
    borderRadius: normalize(12),
    padding: normalize(8),
    zIndex: 3,
    borderWidth: normalize(1.7),
    borderColor: '#6b6463',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: 'space-between',
  },
  gridWrapper: {
    alignItems: 'center',
    flexGrow: 0,
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
    marginBottom: normalize(5),
  },
  pageText: {
    color: '#a37b44',
    fontSize: normalize(5),
  },
});
