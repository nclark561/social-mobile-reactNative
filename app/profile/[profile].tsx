import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Image, TextInput, useColorScheme, Animated, TouchableOpacity, Pressable, Alert } from 'react-native'; // Import Alert
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import MyContext from '../../components/providers/MyContext';
import PostContext from '../../components/providers/PostContext';
import Post from '@/components/postComponents/Post';
import { Link } from 'expo-router';


export default function TabTwoScreen() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState('Posts'); // Track selected option
  const [user, setUser] = useState<any>();
  const context = useContext<any>(MyContext);
  const { setLoginToggle, myInfo, loggedIn, updateUser, updateFollowers } = context
  const postContext = useContext<any>(PostContext);
  const { getUserPosts, posts } = postContext
  const local = useLocalSearchParams()
  const [profileImageUri, setProfileImageUri] = useState('')
  const mortyUrl = 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg'
  const colorScheme = useColorScheme()


  const handleError = () => {
      setProfileImageUri(mortyUrl);
    };

  const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());

  useFocusEffect(
    useCallback(() => {
      getUser();
      return () => {
        setUser('');
      };
    }, [local.profile, myInfo])
  );

  useEffect(() => {
    if (user.id) {
        const newProfileImageUri = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${user?.id}.jpg?${Date.now()}`;
        setProfileImageUri(newProfileImageUri);
    }
}, [myInfo]);

  const getUser = async () => {
    try {
      const result = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/myInfo?email=${local.profile}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userData = await result.json();
      setUser(userData.user);
    } catch (error) {
      console.log(error, "this is the get user error");
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Posts':
        return <ThemedView>
          {Array.isArray(user?.posts) && user?.posts?.map((post: any) => {
            return (
              <Post key={post.id} post={post} user={myInfo.email} />
            )
          })}
        </ThemedView>;
      case 'Likes':
        return <ThemedText>Reposts</ThemedText>;
      case 'Replies':
        return <ThemedView>
          {user?.comments?.map((comment: any) => {
            return (
              <ThemedView key={comment.id || comment.content}>
                <ThemedText style={styles.content}>{comment?.comment}</ThemedText>
              </ThemedView>
            )
          })}
          <ThemedText>kale</ThemedText>
        </ThemedView>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  const isFollowed = (followers: string[]): boolean => {
    return followers.includes(myInfo?.id);
  };

  // Alert function to confirm unfollow action
  const handleUnfollow = () => {
    Alert.alert(
      'Unfollow',
      'Are you sure you want to unfollow?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unfollow',
          onPress: () => updateFollowers(myInfo.id, user.id, user.followers, myInfo.following),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.header}>
        <ThemedView style={[styles.icon, { backgroundColor: `${user?.color}` }]}>
          <Pressable>
            <Link href="/(tabs)/">
              <Ionicons size={25} name="arrow-back-outline" />
            </Link>
          </Pressable>
        </ThemedView>
        <ThemedView style={[styles.backgroundColor, { backgroundColor: user?.color || '#fff' }]}></ThemedView>
        <ThemedView style={styles.row}>
          {loggedIn ? <Image
            style={styles.profilePic}
            source={{ uri: profileImageUri }}
            onError={handleError}
          /> : <ThemedText>Empty Photo</ThemedText>}
          {user && myInfo && myInfo.email !== user.email ? (
            isFollowed(user.followers) ? (
              <Pressable onPress={handleUnfollow}>
                <Ionicons size={25} style={styles.followIcon} name={'checkmark-done-circle-outline'} color={colorScheme === 'dark' ? 'white' : 'black'}></Ionicons>
              </Pressable>
            ) : (              
                <Pressable onPress={() => {
                  updateFollowers(myInfo.id, user.id, user.followers, myInfo.following)
                }}>
                  <ThemedText style={styles.button}>Follow</ThemedText>
                </Pressable>              
            )
          ) : null}
        </ThemedView>
        <ThemedView style={styles.close}>
          {loggedIn ? (
            <>
              <ThemedText style={styles.userName}>{user?.username}</ThemedText>
              <ThemedText style={styles.tag}>@{user?.email}</ThemedText>
            </>
          ) : (
            <ThemedText>Login</ThemedText>
          )}


        </ThemedView>
        <ThemedView style={styles.followersRow}>
          {loggedIn ? <><ThemedText style={styles.smallGray}>{user?.followers?.length} Followers</ThemedText>
            <ThemedText style={styles.smallGray}>{user?.following?.length} Following</ThemedText></> : <ThemedText></ThemedText>}

        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.column}>
        {['Posts', 'Reposts', 'Replies'].map((option) => (
          <TouchableOpacity key={option} onPress={() => setSelectedOption(option)}>
            <ThemedText style={[styles.optionText, selectedOption === option && styles.underline]}>
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
      <ThemedView style={styles.content}>{renderContent()}</ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
    borderColor: '#525252',
  },
  profilePic: {
    borderRadius: 15,
    width: 35,
    height: 35,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',

  },
  tag: {
    fontSize: 10,
    marginLeft: 1,
  },
  locationRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  followersRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
  close: {
    display: 'flex',
    flexDirection: 'column',
  },
  smallGray: {
    fontSize: 11,
    lineHeight: 18,
    color: 'rgb(119 118 118)',
  },
  smallGrayDate: {
    fontSize: 11,
    lineHeight: 18,
    color: 'rgb(119 118 118)',
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 10,
  },
  optionText: {
    fontSize: 16,
    padding: 10,
  },
  underline: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
  button: {
    width: 55,
    fontSize: 12,
    height: 30,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    textAlign: 'center'
  },
  

  black: {
    color: 'black',
    backgroundColor: 'black'
  },
  
  icon: {
    padding: 8,    
  },
  backgroundColor: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '40%',
    width: '110%',
    zIndex: -1,
  },
  followIcon: {}
});
