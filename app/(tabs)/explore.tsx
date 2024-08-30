import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function TabTwoScreen() {
  const navigation = useNavigation()

  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer())

  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} />
        <ThemedView style={[styles.searchInput, { backgroundColor: '#d3d3d3' }]}>
          <Ionicons size={17} name="search" color={'gray'} style={styles.searchIcon}/>
          <TextInput placeholder='Search' placeholderTextColor={'gray'} style={{ maxWidth: '80%' }}/>
        </ThemedView>
        <Ionicons size={25}  name="menu-outline" onPress={handlePress}></Ionicons>
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
    width: "100%",
    borderBottomWidth: .5,
    borderColor: '#525252'
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
