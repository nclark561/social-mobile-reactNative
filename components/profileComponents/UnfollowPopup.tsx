import { Pressable, Text, Modal, StyleSheet } from "react-native";
import React, { SetStateAction } from "react";
import { ThemedView } from "../ThemedView";

interface DeletePopupProps {
  unfollowVisible: boolean;
  setUnfollowVisible: React.Dispatch<SetStateAction<boolean>>
  myInfo: any
  user: any
  updateFollowers: any
  setLoading: React.Dispatch<SetStateAction<boolean>>
}

const UnfollowPopup = ({
  unfollowVisible,
  setUnfollowVisible,
  myInfo,
  user,
  updateFollowers,
  setLoading
}: DeletePopupProps) => {
  return (
    <Modal transparent visible={unfollowVisible} animationType="fade">
      <ThemedView style={styles.modal}>
        <ThemedView style={styles.popup}>
          <Pressable style={styles.deleteButton} onPress={async () => {
            setLoading(true)
            setUnfollowVisible(false)
            await updateFollowers(
                myInfo?.id,
                user?.id,
                user.followers,
                myInfo.following,
              )  
            setLoading(false)  
          }}>
            <Text style={styles.deleteButtonText}>Unfollow</Text>
          </Pressable>
          <Pressable style={styles.center} onPress={() => setUnfollowVisible(false)}>
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
    display: "flex",
    justifyContent: "space-evenly",
    alignContent: "center",
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
  center: {
    display: "flex",
    alignItems: "center",
  },
});

export default UnfollowPopup;
