import { Text, View, TextInput, StyleSheet, Pressable, Image, useColorScheme } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; import { useState, useContext } from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Link, router } from 'expo-router';
import MyContext from './providers/MyContext';

interface HeaderProps {
    name: string
}


export default function Header({ name }: HeaderProps) {
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const context = useContext(MyContext);
    const { setLoginToggle, myInfo } = context
    const handlePress = () => navigation.dispatch(DrawerActions.openDrawer())

    console.log(myInfo)

    return (
        <ThemedView style={styles.page}>
            {myInfo ? <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} /> : <Pressable onPress={() => { router.navigate('/login') }}><ThemedText style={{ marginLeft: 5 }}>Login</ThemedText></Pressable>}
            <ThemedText style={styles.Title}>{name}</ThemedText>
            <Ionicons size={25} name="menu-outline" onPress={handlePress} style={colorScheme === 'dark' && { color: 'white' }}></Ionicons>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        flexDirection: 'row',
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
    Title: {
        fontSize: 25
    }
});
