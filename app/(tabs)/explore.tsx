import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, useColorScheme, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, router } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useContext, useState, useEffect } from 'react';
import MyContext from '../../components/providers/MyContext';
import ProfileDisplay from '@/components/exploreComponents/ProfileDisplay';
import Animated from 'react-native-reanimated';

const noah = {
  email: 'Noah Clark',
  username: 'nclark561',
}

const kale = {
  email: 'Kale Hamm',
  username: 'kaethebae',
}

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn } = context;
  const [searchInput, setSearchInput] = useState('')
  const [ searchResults, setSearchResults ] = useState([])
  const [profileImageUri, setProfileImageUri] = useState(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo?.id}.jpg?${Date.now()}`)
  const mortyUrl = 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg'

  const handleError = () => {
    setProfileImageUri(mortyUrl);
  };


  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());

  const searchUsers = async () => {
    try {
      const result = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/searchUsers?username=${searchInput}`)
      const users = await result.json();
      console.log(users)
      setSearchResults(users.user)
    } catch (err) {
      console.log('oops')
    }
  }

  useEffect(() => {
    if(searchInput.length > 0) searchUsers()
  }, [searchInput])

  return (
    <ThemedView style={{ flex: 1, flexDirection: 'column' }}>
      <ThemedView style={styles.header}>
        {loggedIn ? (
          <Pressable onPress={handlePress}>
            <Image
              style={styles.profilePic}
              source={{ uri: profileImageUri }}
            />
          </Pressable>
        ) : (
          <Pressable onPress={() => { router.navigate('/login') }}>
            <ThemedText style={{ marginLeft: 5 }}>Login</ThemedText>
          </Pressable>
        )}
        <ThemedView style={[styles.searchInput, colorScheme === 'dark' ? { backgroundColor: '#3b3b3b' } : { backgroundColor: '#d3d3d3' }]}>
          <Ionicons size={17} name="search" color={'gray'} style={styles.searchIcon} />
          <TextInput placeholder='Search' placeholderTextColor={'gray'} style={[{ maxWidth: '80%' }, colorScheme === 'dark' && { color: 'white' }]} onChangeText={(text) => setSearchInput(text)} />
        </ThemedView>
        <ThemedView style={{ width: 35 }}></ThemedView>
      </ThemedView>
      {searchInput.length === 0 ? (<>
        <ThemedText style={styles.title} type='title'>Featured</ThemedText>
        <ProfileDisplay user={noah} />
        <ProfileDisplay user={kale} />
      </>
      ) : (
        <>
          <ThemedText style={styles.title} type='title'>Results</ThemedText>
          <Animated.ScrollView>
            {searchResults.length > 0 ? searchResults.map((e: any) => <ProfileDisplay key={e.id} user={e} />) : <ThemedText>No results found</ThemedText>}
          </Animated.ScrollView>
        </>
      )}
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
    width: "100%",
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
  },
  title: {
    margin: 10
  }
});
