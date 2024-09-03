import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, useColorScheme, Animated, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useState } from 'react';

export default function TabTwoScreen() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [selectedOption, setSelectedOption] = useState('Posts'); // Track selected option

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

    return (
        <ThemedView>
            <ThemedView style={styles.header}>
                <ThemedView style={styles.row}>
                    <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} />
                    <TouchableOpacity style={styles.button}>Edit</TouchableOpacity>
                </ThemedView>
                <ThemedView style={styles.close}>
                    <ThemedText style={styles.userName}>UserName</ThemedText>
                    <ThemedText style={styles.tag}>@UserName</ThemedText>
                </ThemedView>

                <ThemedView style={styles.locationRow}>
                    <ThemedText style={styles.smallGray}>location</ThemedText>
                    <ThemedText style={styles.smallGray}>Joined when</ThemedText>
                </ThemedView>
                <ThemedView style={styles.locationRow}>
                    <ThemedText style={styles.smallGray}>Followers</ThemedText>
                    <ThemedText style={styles.smallGray}>Following</ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.column}>
                {['Posts', 'Likes', 'Replies'].map(option => (
                    <TouchableOpacity key={option} onPress={() => setSelectedOption(option)}>
                        <ThemedText style={[styles.optionText, selectedOption === option && styles.underline]}>
                            {option}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </ThemedView>
            <ThemedView style={styles.content}>
                {renderContent()}
            </ThemedView>
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
        width: "100%",
        borderColor: '#525252'
    },
    profilePic: {
        borderRadius: 15,
        width: 35,
        height: 35,
        marginBottom: 15
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 10
    },
    tag: {
        fontSize: 10,
        marginLeft: 1
    },
    locationRow: {
        display: 'flex',
        width: 130,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    close: {
        display: 'flex',
        flexDirection: 'column',
    },
    smallGray: {
        fontSize: 12,
        lineHeight: 18,
        color: "rgb(119 118 118)"
    },
    column: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        marginLeft: 10
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
        width: '95%'
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
