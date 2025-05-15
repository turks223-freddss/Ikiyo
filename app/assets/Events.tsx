import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { normalize } from '../../assets/normalize';
import {
  AvatarIcon,
  MapsIcon,
  HeartIcon,
} from '../../assets/images/homeIcons';

type Tab = 'events' | 'announcements';

type EventCard = {
  id: string;
  title: string;
  date: string;
  bannerUrl?: string;
  details: string;
};

const mockEvents: EventCard[] = [
  {
    id: '1',
    title: 'Patch 1.0 - Launch Update',
    date: '2025-04-01',
    details:
      'Welcome to the official launch of our platform! Enjoy brand new features, performance improvements, and bug fixes.',
  },
  {
    id: '2',
    title: 'Patch 1.1 - Spring Festival',
    date: '2025-04-15',
    details:
      'Celebrate the Spring Festival with limited-time events, quests, and exclusive rewards. Ends May 1!',
  },
  {
    id: '3',
    title: 'Patch 1.2 - Quality of Life',
    date: '2025-05-01',
    details:
      'This update focuses on quality-of-life improvements such as faster loading, UI tweaks, and bug squashing.',
  },
];

const mockAnnouncements: EventCard[] = [
  {
    id: 'a1',
    title: 'Maintenance Notice',
    date: '2025-05-10',
    details: 'We will have scheduled maintenance on May 12, 2:00 AM - 4:00 AM UTC.',
  },
  {
    id: 'a2',
    title: 'Terms of Service Update',
    date: '2025-05-07',
    details: 'Our terms of service have been updated. Please review them in the settings menu.',
  },
];

const EventsAnnouncementsOverlay = () => {
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [selectedEventId, setSelectedEventId] = useState<string>(mockEvents[0].id);
  const tabIndicator = useRef(new Animated.Value(0)).current;

  const data = activeTab === 'events' ? mockEvents : mockAnnouncements;
  const selectedItem = data.find((item) => item.id === selectedEventId);

  useEffect(() => {
    if (data.length > 0) {
      setSelectedEventId(data[0].id);
    }
  }, [activeTab]);

  useEffect(() => {
    Animated.timing(tabIndicator, {
      toValue: activeTab === 'events' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const indicatorTranslate = tabIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, normalize(70)],
  });

  return (
    <View style={styles.overlayContainer}>
      {/* Combined Tab Button */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabBackground}>
          <Animated.View
            style={[
              styles.tabIndicator,
              { transform: [{ translateX: indicatorTranslate }] },
            ]}
          />
          <TouchableOpacity
            style={styles.tabOption}
            onPress={() => setActiveTab('events')}
          >
            <Image source={MapsIcon} style={styles.tabIcon} />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'events' && styles.tabLabelActive,
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabOption}
            onPress={() => setActiveTab('announcements')}
          >
            <Image source={HeartIcon} style={styles.tabIcon} />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'announcements' && styles.tabLabelActive,
              ]}
            >
              Announcements
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.eventList}
          contentContainerStyle={styles.eventListContent}
        >
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedEventId(item.id)}
              style={[
                styles.eventCard,
                item.id === selectedEventId && styles.activeCard,
              ]}
            >
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.imaginaryCard} />
        </ScrollView>

        {selectedItem && (
          <ScrollView style={styles.detailsContainer} contentContainerStyle={{ padding: normalize(3) }}>
            <Image
              source={selectedItem.bannerUrl ? { uri: selectedItem.bannerUrl } : AvatarIcon}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <Text style={styles.detailsTitle}>{selectedItem.title}</Text>
            <Text style={styles.detailsText}>{selectedItem.details}</Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: '#f2ead3',
    padding: normalize(2),
  },
  tabWrapper: {
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  tabBackground: {
    flexDirection: 'row',
    backgroundColor: '#cdb892',
    borderRadius: normalize(20),
    borderWidth: 1,
    borderColor: '#8a6e43',
    overflow: 'hidden',
    position: 'relative',
  },
  tabOption: {
    width: normalize(70),
    paddingVertical: normalize(2),
    paddingHorizontal: normalize(4),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tabIcon: {
    width: normalize(10),
    height: normalize(10),
    marginBottom: normalize(1),
    tintColor: '#3a2e1f',
  },
  tabLabel: {
    fontSize: normalize(5),
    color: '#3a2e1f',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    width: normalize(70),
    height: '100%',
    backgroundColor: '#a37b44',
    borderRadius: normalize(20),
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  eventList: {
    width: '30%',
    borderRadius: normalize(8),
    marginRight: normalize(2),
    backgroundColor: '#f7e6b8',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(3),
    borderWidth: 1,
    borderColor: '#8a6e43',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  eventListContent: {
    padding: normalize(2),
    alignItems: 'center',
  },
  eventCard: {
    width: '90%',
    padding: normalize(2),
    marginBottom: normalize(3),
    borderRadius: normalize(8),
    backgroundColor: '#cdb892',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8a6e43',
  },
  activeCard: {
    backgroundColor: '#a37b44',
    borderColor: '#5e4021',
    transform: [{ scale: 1.05 }],
    marginRight: normalize(6),
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  eventTitle: {
    fontSize: normalize(4),
    fontWeight: '600',
    color: '#3a2e1f',
    flex: 1,
  },
  eventDate: {
    fontSize: normalize(3),
    color: '#3a2e1f',
    marginLeft: normalize(2),
    fontWeight: '600',
  },
  detailsContainer: {
    width: '60%',
    backgroundColor: '#fff7db',
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: '#8a6e43',
    elevation: 4,
    maxHeight: '100%',
  },
  bannerImage: {
    width: '100%',
    height: normalize(20),
    borderRadius: normalize(8),
    marginBottom: normalize(3),
    backgroundColor: '#dbc397',
  },
  detailsTitle: {
    fontSize: normalize(7),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: normalize(2),
    color: '#3a2e1f',
  },
  detailsText: {
    fontSize: normalize(5),
    paddingLeft: normalize(3),
    color: '#3a2e1f',
    lineHeight: normalize(8),
    textAlign: 'justify',
  },
  imaginaryCard: {
    padding: normalize(3),
    marginTop: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventsAnnouncementsOverlay;
