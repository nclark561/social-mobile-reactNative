import { Pressable, Text, Modal, StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "../ThemedView";

interface DeletePopupProps {
  deleteVisible: boolean;
  myInfo: any;
  postOwnerId: string;
  isComment?: boolean;
  deleteComment: any;
  deletePost: any;
  post: any;
  handleCloseDeleteMenu: () => void;
}

const DeletePopup = ({
  deleteVisible,
  myInfo,
  postOwnerId,
  isComment,
  deleteComment,
  deletePost,
  post,
  handleCloseDeleteMenu,
}: DeletePopupProps) => {
  return (
    <Modal transparent visible={deleteVisible} animationType="fade">
      <ThemedView style={styles.modal}>
        <ThemedView style={styles.popup}>
          {myInfo?.id === postOwnerId && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                if (isComment) {
                  deleteComment(post.id);
                } else {
                  deletePost(post.id);
                }
              }}
            >
              <Text style={styles.deleteButtonText}>Delete Post</Text>
            </Pressable>
          )}
          <Pressable onPress={handleCloseDeleteMenu}>
            <Text style={styles.deleteButtonText}>Cancel</Text>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popup: {
    flexDirection: "column",
    width: 400,
    padding: 20,
    borderRadius: 25,
    height: 200,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default DeletePopup;
