// components/MyCustomDrawer.js
import React from 'react';
import { StyleSheet, Image, Button, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { ThemedText } from './ThemedText';
import { supabase } from './Supabase';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyCustomDrawer(props: any) {


    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            await AsyncStorage.removeItem('user');
            if (error) {
                console.log("this is logout error", error);
            }
            router.navigate('/login')
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={styles.header}>
                <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} />
                <ThemedText style={styles.headerText}>UserName</ThemedText>
                <ThemedText style={styles.headerText}>Followers and Following</ThemedText>
            </View>
            <DrawerItemList {...props} />
            <View style={styles.footer}>
                <Button title="Logout" onPress={() => handleLogout()} />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: "column",
        justifyContent: 'space-around',
        alignItems: 'baseline',
        height: "18%",
        padding: 15
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    profilePic: {
        borderRadius: 15,
        width: 35,
        height: 35,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
