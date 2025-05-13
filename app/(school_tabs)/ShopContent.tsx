import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { normalize } from '../../assets/normalize';

const { width } = Dimensions.get('window');
const isTablet = width > 1080;

const selectors = [
  'Hats',
  'Face Accessories',
  'Facial Expression',
  'Upperwear',
  'Lowerwear',
  'Shoes',
];

const items = [
  { id: 1, name: 'Sword', price: 100, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 2, name: 'Shield', price: 150, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 3, name: 'Helmet', price: 120, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 4, name: 'Boots', price: 80, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 5, name: 'Armor', price: 200, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 6, name: 'Cape', price: 90, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 7, name: 'Gloves', price: 60, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 8, name: 'Ring', price: 50, image: require('../../assets/images/homeIcons/avatar.png') },
  { id: 9, name: 'Potion', price: 30, image: require('../../assets/images/homeIcons/avatar.png') },
];

const ITEMS_PER_PAGE = 6;

const ShopScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Hats');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = items.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={normalize(10)} color="#3a2e1f" />
          </View>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Shop</Text>
        <View style={styles.topBarSpacer} />
      </View>

      {/* Main Shop UI */}
      <View style={styles.container}>
        {/* Selector Tabs */}
        <ScrollView
          style={styles.selectorPane}
          contentContainerStyle={[styles.selectorContent, { justifyContent: 'space-between' }]}  // Fixed warning here
          showsVerticalScrollIndicator={false}
        >
          {selectors.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.selectorButton,
                selectedTab === tab && styles.selectorButtonActive,
              ]}
              onPress={() => {
                setSelectedTab(tab);
                setCurrentPage(1); // reset page on tab change
              }}
            >
              <Text
                style={[
                  styles.selectorText,
                  selectedTab === tab && styles.selectorTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Item List */}
        <View style={styles.leftPane}>
          <Text style={styles.title}>{selectedTab}</Text>
          <View style={styles.gridContainer}>
            {itemsToDisplay.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.name}</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>{item.price} G</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Pagination Navigation (Positioned at the bottom of leftPane) */}
          {totalPages > 1 && (
            <View style={styles.paginationWrapper}>
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  onPress={goToPreviousPage}
                  disabled={currentPage === 1}
                  style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.disabledButton,
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
                    currentPage === totalPages && styles.disabledButton,
                  ]}
                >
                  <Ionicons name="chevron-forward" size={normalize(10)} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Avatar Preview */}
        <View style={styles.rightPane}>
          <Text style={styles.title}>Your Avatar</Text>
          <Image
            source={require('../../assets/images/homeIcons/avatar.png')}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f2ead3',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: normalize(2),
    backgroundColor: '#bfa76f',
    borderBottomWidth: normalize(0.5),
    borderColor: '#7a5e3a',
    elevation: 4,
  },
  backButton: {
    padding: normalize(2),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(12),
    borderWidth: normalize(1),
    borderColor: '#7a5e3a',
    backgroundColor: '#dbc397',
  },
  topBarTitle: {
    fontSize: normalize(9),
    fontWeight: 'bold',
    color: '#3a2e1f',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  topBarSpacer: {
    width: normalize(40),
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    padding: normalize(3),
    gap: normalize(4),
  },
  selectorPane: {
    flex: 1,
    backgroundColor: '#f7e6b8',
    borderRadius: normalize(10),
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(3),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  selectorContent: {
    alignItems: 'center',
    gap: normalize(2),
  },
  selectorButton: {
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(6),
    backgroundColor: '#cdb892',
    borderRadius: normalize(6),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    width: '100%',
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: '#a37b44',
    borderColor: '#5e4021',
  },
  selectorText: {
    fontSize: normalize(5),
    color: '#3a2e1f',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  leftPane: {
    flex: 2,
    backgroundColor: '#fff7db',
    padding: normalize(3),
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    elevation: 4,
    flexDirection: 'column',
    justifyContent: 'space-between', // Make sure pagination is at the bottom
  },
  rightPane: {
    flex: 1,
    backgroundColor: '#fff7db',
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    borderColor: '#8a6e43',
    padding: normalize(3),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
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
  avatarImage: {
    width: isTablet ? normalize(300) : normalize(80),
    height: isTablet ? normalize(300) : normalize(80),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: (width * 0.66 - normalize(100)) / 3, // Adjust based on leftPane width and spacing
    aspectRatio: 2,
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
    marginTop: 'auto', // Push it to the bottom of the container
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
  }
});

export default ShopScreen;
