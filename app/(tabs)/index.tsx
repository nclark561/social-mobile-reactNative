import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Animated from 'react-native-reanimated';
import Post from '@/components/Post';

const post1 = {
  user: 'Noah Clark',
  profilePic: 'https://avatars.githubusercontent.com/u/125314332?v=4',
  text: 'I\'m making a social media app. I am typing a bunch of random stuff to create a fake twitter post. this is the best post i ever made'
}

const post2 = {
  user: 'Morty Smith',
  profilePic: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg',
  text: 'You cant keep doing this Rick. Ive almost died 3 times this week, Im exhausted, and I havent been able to go to school in months. Enough is enough.'
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.pageHeader}>
        <ThemedText type='title'>Posts</ThemedText>
      </ThemedView>
      <Animated.ScrollView>
        <Post post={post1}></Post>
        <Post post={post2}></Post>
        <Post post={post1}></Post>
        <Post post={post2}></Post>
        <Post post={post1}></Post>
        <Post post={post2}></Post>
        <Post post={post1}></Post>
        <Post post={post2}></Post>
        <Post post={post1}></Post>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: 'column',
    gap: 8,
    paddingTop: 60,
  },
  pageHeader: {
    borderBottomWidth: .5,
    borderColor: '#949494',
    paddingBottom: 5,
    alignItems: 'center'
  }
});
