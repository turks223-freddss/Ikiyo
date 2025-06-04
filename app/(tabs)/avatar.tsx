import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { normalize } from "../../assets/normalize";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ShopBackground, FaceExIcon, FaceAccIcon, HatsIcon, ShoesIcon, LowerIcon, EyesIcon, UpperIcon } from "../../assets/images/shopIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { default as AvatarDisplay } from "../assets/avatar/avatarComponent";
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

const selectors = [
  { label: 'Hat', icon: HatsIcon },
  { label: 'Eyes', icon: EyesIcon },
  { label: 'Face Accessories', icon: FaceAccIcon },
  { label: 'Facial Expression', icon: FaceExIcon },
  { label: 'Upperwear', icon: UpperIcon },
  { label: 'Lowerwear', icon: LowerIcon },
  { label: 'Shoes', icon: ShoesIcon },
];

type SelectorTabs = 'Hat' | 'Eyes' | 'Face Accessories' | 'Facial Expression' | 'Upperwear' | 'Lowerwear' | 'Shoes';
const ITEMS_PER_PAGE = 9;

interface Item {
  item_id: number;
  item_name: string;
  store_image: string;
  avatar_image: string;
  price: number;
  part: string;
  category: string;
  isPlaceholder?: boolean;
}

const AvatarScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<SelectorTabs>('Hat');
  const [currentPage, setCurrentPage] = useState(0);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [userID, setUserID] = useState<number | null>(null);
  const [previewedItem, setPreviewedItem] = useState<Item | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Fetch user and inventory
  useEffect(() => {
    const fetchUserAndInventory = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        let userID = null;

        if (userData) {
          const parsedUser = JSON.parse(userData);
          userID = typeof parsedUser === "number" ? parsedUser : parsedUser.userID;
          setUserID(userID);
        }

        if (userID) {
          const response = await fetch('http://192.168.1.5:8081/api/display-inventory-avatar/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID }),
          });

          if (!response.ok) throw new Error('Failed to fetch inventory');
          const data = await response.json();
          setItems(data.accessories_items || []);
        }
      } catch (error) {
        console.error("Error in fetchUserAndInventory:", error);
      }
    };

    fetchUserAndInventory();
  }, []);

  // Filtering and pagination
  const filteredItems = items.filter(item => item.part === selectedTab);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems
    .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const lastPageCount = filteredItems.length % ITEMS_PER_PAGE || ITEMS_PER_PAGE;
  const placeholdersNeeded = ITEMS_PER_PAGE - lastPageCount;

  const itemsToDisplay = paginatedItems.concat(
    currentPage === totalPages - 1 && placeholdersNeeded > 0
      ? Array.from({ length: placeholdersNeeded }).map((_, i) => ({
          item_id: -1 * (i + 1),
          item_name: '',
          store_image: '',
          avatar_image: '',
          price: 0,
          part: '',
          category: '',
          isPlaceholder: true,
        }))
      : []
  );

  // Equip logic
  const handleEquip = async (item: Item) => {
    try {
      if (!userID) return;
      const requestBody = {
        userID,
        item_type: item.part.toLowerCase(),
        url: item.avatar_image,
      };
      const response = await fetch('http://192.168.1.5:8081/api/retrieve-avatar/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to equip item');
      setShowSaveButton(false);
      setPreviewedItem(null);
    } catch (error) {
      console.error('Equip Error:', error);
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                  {selectors.map(({ label, icon }) => (
                    <TouchableOpacity
                      key={label}
                      style={[
                        styles.filterButton,
                        selectedTab === label && styles.filterButtonSelected,
                      ]}
                      onPress={() => {
                        setSelectedTab(label as SelectorTabs);
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
              data={itemsToDisplay}
              numColumns={3}
              keyExtractor={(item, idx) => item.item_id !== undefined ? String(item.item_id) : `placeholder-${idx}`}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) =>
                !item.isPlaceholder ? (
                  <TouchableOpacity
                    style={[
                      styles.itemBox,
                      activeItemId === item.item_id && styles.itemBoxSelected,
                    ]}
                    onPress={() => {
                      setActiveItemId(item.item_id);
                      setPreviewedItem(item);
                      setShowSaveButton(true);
                    }}
                  >
                    <Image source={{ uri: item.store_image }} style={styles.itemIcon} />
                    <Text style={styles.itemName}>{item.item_name}</Text>
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

        {/* Avatar Display */}
        <View style={styles.avatarcontainer}>
          <View style={styles.avatarHeaderRow}>
            {showSaveButton && previewedItem && (
              <TouchableOpacity
                style={styles.avatarHeaderButton}
                onPress={() => {
                  setPreviewedItem(null);
                  setShowSaveButton(false);
                  setActiveItemId(null);
                }}
              >
                <MaterialIcons
                  name="close"
                  size={normalize(10)}
                  color="#b71c1c"
                />
              </TouchableOpacity>
            )}
              <Text style={[styles.title, { color: "#3a2e1f" }]}>Your Avatar</Text>
              {showSaveButton && previewedItem && (
                <TouchableOpacity
                style={styles.avatarHeaderButton}
                disabled={!(showSaveButton && previewedItem)}
                onPress={async () => {
                  if (!previewedItem) return;
                  try {
                    const requestBody = {
                      userID,
                      item_type: previewedItem.part.toLowerCase(),
                      url: previewedItem.avatar_image,
                    };
                    console.log('Sending body to API:', requestBody);
                    const response = await fetch('http://192.168.1.5:8081/api/retrieve-avatar/', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) {
                      throw new Error('Failed to equip item');
                    }

                    const result = await response.json();
                    console.log('Item equipped:', result);
                    router.replace("/(tabs)/avatar"); // ✅ exact path to avatar.tsx
                    setShowSaveButton(false);
                    setPreviewedItem(null);
                  } catch (error) {
                    console.error('Equip Error:', error);
                  }
                }}
              >
                <MaterialIcons
                  name="check"
                  size={normalize(10)}
                  color={showSaveButton && previewedItem ? "#388e3c" : "#bbb"}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={{
            width: normalize(90),
            height: "110%",
            maxWidth: '100%',
            maxHeight: '105%',
            overflow: 'hidden',
            alignItems: 'center',
          }}>
          <AvatarDisplay
            userID={userID!}
            overrideHat={previewedItem?.part === "Hat" ? previewedItem.avatar_image : undefined}
            overrideEyes={previewedItem?.part === "Eyes" ? previewedItem.avatar_image : undefined}
            overrideFaceAccessories={previewedItem?.part === "Face Accessories" ? previewedItem.avatar_image : undefined}
            overrideFacialExpression={previewedItem?.part === "Facial Expression" ? previewedItem.avatar_image : undefined}
            overrideUpperwear={previewedItem?.part === "Upperwear" ? previewedItem.avatar_image : undefined}
            overrideLowerwear={previewedItem?.part === "Lowerwear" ? previewedItem.avatar_image : undefined}
            overrideShoes={previewedItem?.part === "Shoes" ? previewedItem.avatar_image : undefined}
          />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  avatarcontainer: {
    backgroundColor: 'white',
    marginHorizontal: normalize(15),
    flex: 3,
    borderRadius: normalize(12),
    padding: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
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
  saveButton: {
    marginTop: normalize(10),
    backgroundColor: '#ecc96b',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(6),
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#3a2e1f',
    fontWeight: 'bold',
    fontSize: normalize(5),
  },
  avatarHeaderButton: {
    borderRadius: normalize(6),
    backgroundColor: '#fff7db',
    borderWidth: 1,
    borderColor: '#8a6e43',
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(12),
    height: normalize(12),
  },
  avatarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: normalize(5),
    gap: normalize(5),
  },
});
