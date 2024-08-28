import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Animated from 'react-native-reanimated';
import Post from '@/components/Post';
import Header from '@/components/Header';
import { useColorScheme } from 'react-native';

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

const posts = [post1, post2, post1, post2, post1, post2, post1, post2, post1]

export default function HomeScreen() {
  const colorScheme = useColorScheme()

  return (
    <ThemedView style={styles.pageContainer}>
      {/* <Header name='Posts'/> */}
      <Animated.ScrollView>
        {posts.map((e, i) => <Post key={i} post={e}/>)}
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: 'column',
    gap: 8,
   
  },

});
