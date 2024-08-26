import { StyleSheet, Image } from "react-native"
import { ThemedText } from "./ThemedText"
import { ThemedView } from "./ThemedView"
import Ionicons from '@expo/vector-icons/Ionicons';

interface Post {
    user: string,
    profilePic: string,
    text: string
}

export default function Post({post}: {post: Post}) {
  return (
    <ThemedView style={styles.postContainer}>
        <ThemedView>
            <Image
             style={styles.profilePic}
             source={{uri: post.profilePic}}
            />
        </ThemedView>
        <ThemedView style={styles.postContent}>
            <ThemedText style={styles.postUser}>{post.user}</ThemedText>
            <ThemedText style={styles.postText}>{post.text}</ThemedText>
            <ThemedView style={styles.reactionsContainer}>
                <Ionicons size={20} name="chatbubble-outline" />
                <Ionicons size={20} name="git-compare-outline" />
                <Ionicons size={20} name="heart-outline" />
                <Ionicons size={20} name="share-outline" />
            </ThemedView>
        </ThemedView>
        <Ionicons size={20} name="ellipsis-horizontal" style={styles.ellipsis}/>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    postContainer: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: .5,
        borderColor: '#bebebe',
        paddingBottom: 2,
    },
    profilePicContainer: {
        flexDirection: "column",
    },
    profilePic: {
        borderRadius: 25,
        width: 35,
        height: 35,
        marginTop: 6,
        marginHorizontal: 10,
    },
    postContent: {
        flexDirection: 'column',
        paddingVertical: 8,
        flexShrink: 1,
        marginRight: 10
    },
    postUser: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingBottom: 2,
    },
    postText: {
        flexShrink: 1
    },
    ellipsis: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    reactionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
    }
})
