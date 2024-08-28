import { Text, View, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; import { useState } from 'react';




export default function Header({ name }: { name: string }) {


    return (
        <View style={styles.page}>
            <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} />
            <Text style={styles.Title}>{name}</Text>
            <Ionicons size={25}  name="menu-outline"></Ionicons>
        </View>
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
        width: "100%"
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
