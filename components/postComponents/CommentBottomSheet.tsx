import { StyleSheet, Button, Pressable, Image, useColorScheme, View, Text } from "react-native";
import CustomBottomSheet from "../util/CustomBottomSheet";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useState, useRef, useContext, useEffect } from "react";
import MyContext from "../providers/MyContext";
import { ScrollView } from "react-native-gesture-handler";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

interface CommentBottomSheetProps {
  isComment?: boolean;
  post: any;
  commentModalRef: any
}

const CommentBottomSheet = ({ isComment, post, commentModalRef }: CommentBottomSheetProps) => {
  const [commentInput, setCommentInput] = useState("");
  const { myInfo } = useContext<any>(MyContext);
  const [profileImageUri, setProfileImageUri] = useState('')
  const mortyUrl = 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg'
  const colorScheme = useColorScheme()

  const handleCloseComment = () => commentModalRef.current?.dismiss();

  const addComment = async (
    comment: string,
    userName: string,
    postId: string,
    userId: string,
    parentId?: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
            userName,
            postId,
            userId,
            parentId,
          }),
        }
      );
      const post = await response.json();
      handleCloseComment()
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  // useEffect(() => {
  //   if (myInfo?.id) {
  //     const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}.jpg?${Date.now()}`;
  //     setProfileImageUri(newProfileImageUri);
  //   }
  // }, [myInfo]);


  return (
    <CustomBottomSheet
      snapPercs={["70%"]}
      ref={commentModalRef}
      hideCancelButton
    >
      <ThemedView style={styles.commentContainer}>
        <ThemedView style={styles.buttonContainer}>
          <Button title="Cancel" onPress={handleCloseComment}></Button>
          <Pressable
            onPress={() => {
              if (isComment) {
                if (!post.postId) return;
                addComment(
                  commentInput,
                  myInfo.username,
                  post.postId,
                  myInfo.id,
                  post.id
                );
              } else {
                addComment(commentInput, myInfo.username, post.id, myInfo.id);
              }
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
              uri: "https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg",
            }}
          />
          <ThemedText style={styles.postUser}>{post?.userName}</ThemedText>
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
              uri: "https://avatars.githubusercontent.com/u/125314332?v=4",
            }}
          />
          <BottomSheetTextInput
            autoFocus
            onChangeText={(input) => setCommentInput(input)}
            multiline
            placeholder="Post your reply"
            style={[
              { paddingTop: 15, maxWidth: "80%" },
              colorScheme === "dark"
                ? { color: "#bebebe" }
                : { color: "#525252" },
            ]}
          />
        </ThemedView>
      </ThemedView>
    </CustomBottomSheet>
  );
};

export default CommentBottomSheet;

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "column",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  postUser: {
    fontWeight: "bold",
    fontSize: 15,
    paddingBottom: 2,
  },
});
