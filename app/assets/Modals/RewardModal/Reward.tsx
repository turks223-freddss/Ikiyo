import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./Reward.styles";

interface RewardPopupProps {
  visible: boolean;
  onClose: () => void;
  onGet: () => void;
  rewardAmount: number;
}

export default function RewardPopup({
  visible,
  onGet,
  rewardAmount,
}: RewardPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.headerText}>REWARDS</Text>
          <View style={styles.rewardBox}>
            <View style={styles.coinGlow}>
              <Image
                source={require("../../../../assets/images/homeIcons/ikicoin.png")}
                style={styles.coin}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.amount}>{rewardAmount}</Text>
          </View>
          <TouchableOpacity style={styles.claimButton} onPress={onGet}>
            <Text style={styles.claimButtonText}>CLAIM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
