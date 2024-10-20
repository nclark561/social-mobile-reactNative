import { Pressable, Modal, useColorScheme, StyleSheet, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";

interface SharePopupProps {
  shareVisible: boolean;
  handleCloseShare: () => void;
}

const SharePopup = ({ shareVisible, handleCloseShare }: SharePopupProps) => {
  const colorScheme = useColorScheme();

  return (
    <Modal transparent visible={shareVisible} animationType="fade">
      <ThemedView style={[styles.popup]}>
        <ThemedView style={styles.shareOption}>
          <Ionicons
            size={25}
            name="copy-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          ></Ionicons>
          <ThemedText style={styles.optionText}>Copy Link</ThemedText>
        </ThemedView>
        <Pressable
          onPress={() => {
            handleCloseShare();
          }}
        >
          <Text style={styles.cancelButton}>Cancel</Text>
        </Pressable>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    padding: 10,
  },
  cancelButton: {
    backgroundColor: "#26a7de",
    borderRadius: 15,
    padding: 5,
    color: 'white'
  },
  popup: {
    flexDirection: 'column',
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    padding: 20,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default SharePopup;
