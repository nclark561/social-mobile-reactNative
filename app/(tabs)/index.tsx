import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Animated from 'react-native-reanimated';
import Post from '@/components/Post';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.pageContainer}>
      <ThemedView style={styles.pageHeader}>
        <ThemedText type='title'>Posts</ThemedText>
      </ThemedView>
      <Animated.ScrollView>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
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
