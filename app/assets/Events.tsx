import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';

interface PatchCardProps {
    id: number;
    title: string;
    onClick: () => void;
    isActive: boolean;
}

const PatchCard: React.FC<PatchCardProps> = ({ title, onClick, isActive }) => (
    <TouchableOpacity
    style={[styles.patchCard, isActive && styles.activePatchCard]}
    onPress={onClick}
    >
    <Text style={styles.patchCardText}>{title}</Text>
    </TouchableOpacity>
);

const PatchViewer: React.FC = () => {
const [activeTab, setActiveTab] = useState<'left' | 'right'>('left');
const [activePatchId, setActivePatchId] = useState<number>(1);

const patches = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Patch ${i + 1}`,
    notes: (`Details for patch ${i + 1}.\n`).repeat(10),
}));

const activePatch = patches.find((p) => p.id === activePatchId)!;

    return (
        <View style={styles.container}>
        {/* Top Tabs */}
        <View style={styles.tabContainer}>
            <TouchableOpacity
            style={[styles.tabButton, activeTab === 'left' && styles.activeTab]}
            onPress={() => setActiveTab('left')}
            >
            <Text style={styles.tabText}>Left Tab</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.tabButton, activeTab === 'right' && styles.activeTab]}
            onPress={() => setActiveTab('right')}
            >
            <Text style={styles.tabText}>Right Tab</Text>
            </TouchableOpacity> 
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
            {/* Patch List */}
            <ScrollView style={styles.patchList}>
            {patches.map((patch) => (
                <PatchCard
                key={patch.id}
                id={patch.id}
                title={patch.title}
                isActive={patch.id === activePatchId}
                onClick={() => setActivePatchId(patch.id)}
                />
            ))}
            </ScrollView>

            {/* Patch Content */}
            <ScrollView style={styles.patchContent}>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>Banner Image</Text>
            </View>
            <Text style={styles.patchTitle}>{activePatch.title}</Text>
            <Text style={styles.patchNotes}>{activePatch.notes}</Text>
            </ScrollView>
        </View>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'red',
        width: "100%",
        height: "100%",
    },
    tabContainer: {
        height: 50,
        flexDirection: 'row',
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#888',
    },
    activeTab: {
        backgroundColor: '#3366ff',
    },
    tabText: {
        color: 'white',
        fontSize: 16,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    patchList: {
        width: '25%',
        backgroundColor: '#f2f2f2',
    },
    patchCard: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    activePatchCard: {
        backgroundColor: '#cce0ff',
    },
    patchCardText: {
        fontSize: 14,
    },
    patchContent: {
        width: '75%',
        padding: 12,
    },
    banner: {
        height: 100,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    bannerText: {
        fontSize: 16,
        fontWeight: '600',
    },
    patchTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    patchNotes: {
        fontSize: 14,
        color: '#333',
    },
});

export default PatchViewer;
