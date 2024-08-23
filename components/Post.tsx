import { StyleSheet, Image } from "react-native"
import { ThemedText } from "./ThemedText"
import { ThemedView } from "./ThemedView"


export default function Post() {
  return (
    <ThemedView style={styles.postContainer}>
        <ThemedView>
            <Image
             style={styles.profilePic}
             source={{uri: 'https://avatars.githubusercontent.com/u/125314332?v=4'}}
            />
        </ThemedView>
        <ThemedView style={styles.postContent}>
            <ThemedText style={styles.postUser}>Noah Clark</ThemedText>
            <ThemedText>I'm making a social media app.</ThemedText>
        </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    postContainer: {
        flexDirection: 'row',
        borderBottomWidth: .2,
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
    },
    postUser: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingBottom: 2,
    },
})
