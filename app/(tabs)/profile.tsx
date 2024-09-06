import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext } from 'react';
import { StyleSheet, Image, TextInput, useColorScheme, Animated, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import MyContext from '../../components/providers/MyContext';

export default function TabTwoScreen() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [selectedOption, setSelectedOption] = useState('Posts'); // Track selected option
    const [user, setUser] = useState<any>();
    const context = useContext<any>(MyContext);
    const { setLoginToggle, myInfo, loggedIn } = context

    const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());

    


    const renderContent = () => {
        switch (selectedOption) {
            case 'Posts':
                return <ThemedText>Posts Content</ThemedText>;
            case 'Likes':
                return <ThemedText>Likes Content</ThemedText>;
            case 'Replies':
                return <ThemedText>Replies Content</ThemedText>;
            default:
                return null;
        }
    };

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };




    console.log(myInfo, "myInfo object")

    return (
        <ThemedView>
            <ThemedView style={styles.header}>
                <ThemedView style={styles.row}>
                    {loggedIn ? <Image
                        style={styles.profilePic}
                        source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }}
                    /> : <ThemedText>Empty Photo</ThemedText>}

                    <TouchableOpacity style={styles.button}>
                        <ThemedText>Edit</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView style={styles.close}>
                    {loggedIn ? <><ThemedText style={styles.userName}>{myInfo?.username}</ThemedText>
                        <ThemedText style={styles.tag}>@{myInfo?.email}</ThemedText></> : <ThemedText>Login </ThemedText>}

                </ThemedView>
                {/* <ThemedView style={styles.locationRow}>
                    {loggedIn ? <><ThemedText style={styles.smallGray}>{user?.location}</ThemedText>
                        <ThemedText style={styles.smallGrayDate}>
                            Joined {myInfo?.date ? formatDate(myInfo?.date) : ''}
                        </ThemedText></> : <ThemedText></ThemedText>}

                </ThemedView> */}
                <ThemedView style={styles.followersRow}>
                    {loggedIn ? <><ThemedText style={styles.smallGray}>{myInfo?.followers.length} Followers</ThemedText>
                        <ThemedText style={styles.smallGray}>{myInfo?.following.length} Following</ThemedText></> : <ThemedText></ThemedText>}

                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.column}>
                {['Posts', 'Likes', 'Replies'].map((option) => (
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
        marginBottom: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 10,
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
        width: '95%',
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
        width: 45,
        fontSize: 12,
        height: 35,
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
    },
});
