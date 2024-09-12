import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, useColorScheme, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useContext } from 'react';
import MyContext from '../../components/providers/MyContext';

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn } = context;

  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        {loggedIn ? (
          <Pressable onPress={handlePress}>
            <Image 
              style={styles.profilePic} 
              source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} 
            />
          </Pressable>
        ) : (
          <Pressable onPress={() => { router.navigate('/login') }}>
            <ThemedText style={{ marginLeft: 5 }}>Login</ThemedText>
          </Pressable>
        )}
        <ThemedView style={[styles.searchInput, colorScheme === 'dark' ? { backgroundColor: '#3b3b3b' } : { backgroundColor: '#d3d3d3' }]}>
          <Ionicons size={17} name="search" color={'gray'} style={styles.searchIcon} />
          <TextInput placeholder='Search' placeholderTextColor={'gray'} style={[{ maxWidth: '80%' }, colorScheme === 'dark' && { color: 'white' }]} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "80%",
    borderBottomWidth: .5,
    borderColor: 'rgb(232,232,232)'
  },
  profilePic: {
    borderRadius: 15,
    width: 35,
    height: 35,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 6,
    width: '70%'
  },
  searchIcon: {
    marginHorizontal: 3
  }
});
