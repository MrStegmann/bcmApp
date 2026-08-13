import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface DeleteModalProps {
  visible: boolean;
  title: string;
  isDeleting: boolean;
  onCancel: () => void;
  onDelete: () => Promise<void>;
}

export default function DeleteModal({ visible, title, isDeleting, onCancel, onDelete }: DeleteModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.body}>This action cannot be undone. Are you sure?</Text>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={isDeleting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete} disabled={isDeleting}>
              <Text style={styles.deleteText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'red',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
