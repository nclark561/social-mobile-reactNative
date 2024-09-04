import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, useColorScheme, Animated, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function TabTwoScreen() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [selectedOption, setSelectedOption] = useState('Posts'); // Track selected option
    const [user, setUser] = useState();

    const handlePress = () => navigation.dispatch(DrawerActions.openDrawer());

    const getUser = async () => {
        try {
            const userEmail = await AsyncStorage.getItem("user");
            const email = JSON.parse(userEmail)
            const result = await fetch(
                `https://engaged-rattler-correctly.ngrok-free.app/api/myInfo?email=${email}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const userInfo = await result.json();
            setUser(userInfo.Hello);
            console.log(userInfo, 'result info')
        } catch (error) {
            console.log(error, 'this is the create user error');
        }
    };

    useEffect(() => {
        console.log('hitting get user')
        getUser();
    }, []);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };

    console.log(user, 'this is the user');

    return (
        <ThemedView>
            <ThemedView style={styles.header}>
                <ThemedView style={styles.row}>
                    <Image
                        style={styles.profilePic}
                        source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }}
                    />
                    <TouchableOpacity style={styles.button}>
                        <ThemedText>Edit</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView style={styles.close}>
                    <ThemedText style={styles.userName}>{user?.username}</ThemedText>
                    <ThemedText style={styles.tag}>@{user?.email}</ThemedText>
                </ThemedView>

                <ThemedView style={styles.locationRow}>
                    <ThemedText style={styles.smallGray}>{user?.location}</ThemedText>
                    <ThemedText style={styles.smallGrayDate}>
                        Joined {user?.date ? formatDate(user.date) : ''}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.followersRow}>
                    <ThemedText style={styles.smallGray}>{user?.followers.length} Followers</ThemedText>
                    <ThemedText style={styles.smallGray}>{user?.following.length} Following</ThemedText>
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
        width: 35,
        fontSize: 12,
        height: 20,
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
    },
});
