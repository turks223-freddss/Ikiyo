import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "./ToastModal.styles";

interface ToastModalProps {
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    title?: string;
}

export default function ToastModal({
    visible,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    title,
}: ToastModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    <Text style={styles.message}>{message}</Text>
                    <View style={onCancel ? styles.buttonRow : styles.buttonSingle}>
                        {onCancel && (
                            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}