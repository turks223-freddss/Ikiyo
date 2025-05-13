import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '../../../assets/normalize';

// Define the type for each item
interface Item {
  id: number;
  name: string;
  price: number;
  image: any; // You can replace 'any' with a more specific type if needed (like ImageSourcePropType)
}

interface ItemListProps {
  items: Item[];
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage
}) => {

  return (
    <View style={styles.leftPane}>
      <Text style={styles.title}>Items</Text>
      <View style={styles.gridContainer}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={item.image} style={styles.itemImage} />
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>{item.price} G</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <View style={styles.paginationWrapper}>
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={goToPreviousPage}
              disabled={currentPage === 1}
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.disabledButton
              ]}
            >
              <Ionicons name="chevron-back" size={normalize(10)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>
              {currentPage} / {totalPages}
            </Text>
            <TouchableOpacity
              onPress={goToNextPage}
              disabled={currentPage === totalPages}
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.disabledButton
              ]}
            >
              <Ionicons name="chevron-forward" size={normalize(10)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  leftPane: {
    flex: 2,
    backgroundColor: '#fff7db',
    padding: normalize(3),
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    elevation: 4,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: normalize(8),
    fontWeight: 'bold',
    color: '#3a2e1f',
    borderBottomWidth: normalize(1),
    borderColor: '#8a6e43',
    paddingBottom: normalize(1),
    marginBottom: normalize(3),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    padding: normalize(2),
    marginBottom: normalize(4),
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
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: normalize(5),
    color: '#3a2e1f',
    textAlign: 'center',
    marginVertical: normalize(1),
  },
  buyButton: {
    backgroundColor: '#a37b44',
    paddingVertical: normalize(1.5),
    paddingHorizontal: normalize(3),
    borderRadius: normalize(5),
    borderWidth: normalize(1),
    borderColor: '#5e4021',
  },
  buyButtonText: {
    fontSize: normalize(5),
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationWrapper: {
    marginTop: 'auto',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(25),
    gap: normalize(2),
  },
  paginationButton: {
    backgroundColor: '#a37b44',
    padding: normalize(2),
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
  },
});

export default ItemList;
