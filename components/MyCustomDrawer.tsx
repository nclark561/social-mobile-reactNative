// components/MyCustomDrawer.js
import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

export default function MyCustomDrawer(props: any) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={styles.header}>
                <Image style={styles.profilePic} source={{ uri: 'https://cdn.costumewall.com/wp-content/uploads/2017/01/morty-smith.jpg' }} />
                <Text style={styles.headerText}>UserName</Text>
                <Text style={styles.headerText}>Followers and Following</Text>
            </View>
            <DrawerItemList {...props} />
            <View style={styles.footer}>
                <Button title="Logout" onPress={() => console.log('Logout pressed')} />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection:"column",
        justifyContent:'space-around',
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
