import {
  Modal,
  TextInput,
  Pressable,
  Text,
  View,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import AnimatedUnderlineText from "../desktopComponents/animatedUnderlineText";
import { Image } from "expo-image";
import { ScrollView } from "react-native-gesture-handler";
import { SetStateAction } from "react";

interface commentVisible {
  commentVisible: boolean;
  handleCloseComment: () => void;
  isComment?: boolean;
  post: any;
  addComment: any;
  commentInput: string;
  myInfo: any;
  setCommentInput: React.Dispatch<SetStateAction<string>>;
}

const CommentPopup = ({
  commentVisible,
  handleCloseComment,
  isComment,
  post,
  addComment,
  commentInput,
  myInfo,
  setCommentInput,
}: commentVisible) => {
  const colorScheme = useColorScheme();
  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/profile-images/${id}?${Date.now()}`;
      return newProfileImageUri;
    }
  };

  const blurhash = isComment ? post?.user?.blurhash : post?.owner?.blurhash;
  const blurhash2 = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";



  return (
    <Modal transparent visible={commentVisible} animationType="fade">
      <ThemedView style={styles.modal}>
        <ThemedView style={styles.popup}>
          <ThemedView
            style={[
              styles.buttonContainer,
              { justifyContent: "space-between" },
            ]}
          >
            <Pressable onPress={handleCloseComment}>
              <AnimatedUnderlineText>Cancel</AnimatedUnderlineText>
            </Pressable>
            <Pressable
              onPress={() => {
                  addComment(
                    commentInput,
                    myInfo?.username,
                    post?.post_id,
                    myInfo?.id,
                    post?.id
                  );
                
              }}
              style={styles.postButton}
            >
              <Text style={styles.buttonText}>Post</Text>
            </Pressable>
          </ThemedView>
          <ThemedView style={styles.commentOP}>
            <Image
              style={styles.commentPic}
              source={{
                uri: `${profileImage(post?.owner?.id || post?.userId)}`,
              }}
              placeholder={{
                blurhash: blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe",
              }}
              transition={500}
            />
            <ThemedText style={styles.postUser}>
              {post?.email || post?.userName}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.commentOGPost}>
            <View style={styles.line}></View>
            <ScrollView style={styles.commentScroll}>
              <ThemedText>{post?.content}</ThemedText>
            </ScrollView>
          </ThemedView>
          <ThemedView style={{ flexDirection: "row" }}>
            <Image
              style={styles.commentPic}
              source={{
                uri: `${profileImage(myInfo?.id)}`,
              }}
              placeholder={{ blurhash: blurhash2 }}
              transition={500}
            />
            <TextInput
              autoFocus
              onChangeText={(input) => setCommentInput(input)}
              multiline
              placeholder="Post your reply"
              style={[
                { marginTop: 15, maxWidth: "80%", width: "100%", paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 3 },
                colorScheme === "dark"
                  ? { color: "#bebebe" }
                  : { color: "#525252" },
              ]}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  postUser: {
    fontWeight: "bold",
    fontSize: 13,
    paddingBottom: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
  postButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#26a7de",
  },
  buttonText: {
    color: "white",
  },
  commentOP: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentPic: {
    borderRadius: 25,
    width: 25,
    height: 25,
    margin: 10,
  },
  commentOGPost: {
    flexDirection: "row",
    marginVertical: 5,
    maxHeight: "55%",
  },
  line: {
    backgroundColor: "#bebebe",
    width: 3,
    borderRadius: 25,
    marginHorizontal: 21,
  },
  commentScroll: {
    maxWidth: "80%",
    paddingRight: 10,    
  },
  popup: {
    flexDirection: "column",
    width: 800,    
    padding: 40,
    borderRadius: 25,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default CommentPopup;
