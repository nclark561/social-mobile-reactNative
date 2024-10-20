import { Modal, Pressable, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";
import AnimatedUnderlineText from "../desktopComponents/animatedUnderlineText";

interface RepostPopupProps {
  repostVisible: boolean;
  repostedByMe: boolean;
  myInfo: any;
  post: any;
  repost: any;
  undoRepost: any;
  handleCloseRepost: () => void
}

const RepostPopup = ({
  repostVisible,
  repostedByMe,
  myInfo,
  post,
  repost,
  undoRepost,
  handleCloseRepost
}: RepostPopupProps) => {
  const colorScheme = useColorScheme();
  return (
    <Modal transparent visible={repostVisible} animationType="fade">
      <ThemedView
        style={[styles.popup, { marginBottom: 30, height: "75%" }]}
      >
        <ThemedView
          style={[styles.buttonContainer, { justifyContent: "flex-start" }]}
        >
          <Pressable onPress={handleCloseRepost}>
            <AnimatedUnderlineText>Cancel</AnimatedUnderlineText>
          </Pressable>
        </ThemedView>
        <ThemedView>
          {!repostedByMe ? (
            <Pressable
              onPress={() => {
                repost(myInfo?.id, post.id);
              }}
              style={[styles.shareOption, { marginTop: 10 }]}
            >
              <Ionicons
                size={25}
                name="git-compare-outline"
                color={colorScheme === "dark" ? "white" : "black"}
              ></Ionicons>
              <ThemedText style={styles.optionText}>Repost</ThemedText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                undoRepost(myInfo?.id, post.id);
              }}
              style={[styles.shareOption, { marginTop: 10 }]}
            >
              <Ionicons
                size={25}
                name="git-compare-outline"
                color="red"
              ></Ionicons>
              <ThemedText style={[styles.optionText, { color: "red" }]}>
                Undo Repost
              </ThemedText>
            </Pressable>
          )}
        </ThemedView>
        <ThemedView
          style={[
            styles.shareOption,
            { marginTop: 10, backgroundColor: "transparent" },
          ]}
        >
          <Ionicons
            size={25}
            name="pencil-outline"
            color={colorScheme === "dark" ? "white" : "black"}
          ></Ionicons>
          <ThemedText style={styles.optionText}>Quote</ThemedText>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popup: {
    flexDirection: 'column',
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    padding: 20,
    borderRadius: 25,
    height: 200
  },
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
});

export default RepostPopup;
