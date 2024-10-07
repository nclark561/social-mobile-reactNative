import {
    Text,
    View,
    TextInput,
    StyleSheet,
    Pressable,
    useColorScheme,
    Dimensions
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useContext, useEffect, useMemo } from "react";
import { ThemedView } from ".././ThemedView";
import { ThemedText } from ".././ThemedText";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Link, router } from "expo-router";
import MyContext from ".././providers/MyContext";
import { Image } from "expo-image";



export default function DesktopRouting() {

    return (
        <ThemedView style={styles.desktopHidden}>
            <ThemedView style={styles.iconRow}>
                <Link href={'/(drawer)/(tabs)/'}>
                    <Ionicons size={20} style={{ padding: 10 }} name="home-outline"></Ionicons>
                    <ThemedText style={styles.iconSelection}>Home</ThemedText>
                </Link>
            </ThemedView>
            <ThemedView style={styles.iconRow}>
                <Link href={'/(drawer)/(tabs)/profile'}>
                    <Ionicons size={20} style={{ padding: 10 }} name="person-outline"></Ionicons>
                    <ThemedText style={styles.iconSelection}>Profile</ThemedText>
                </Link>
            </ThemedView>
            <ThemedView style={styles.iconRow}>
                <Link href={'/(drawer)/(tabs)/messages'}>
                    <Ionicons size={20} style={{ padding: 10 }} name="mail-outline"></Ionicons>
                    <ThemedText style={styles.iconSelection}>Messages</ThemedText>
                </Link>
            </ThemedView>
            <ThemedView style={styles.iconRow}>
                <Ionicons size={20} style={{ padding: 10 }} name="moon-outline"></Ionicons>
                <ThemedText style={styles.iconSelection}>Dark Mode</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    desktopHidden: {
        display: width > 600 ? 'flex' : 'none',
        height: '50%',
        justifyContent: 'space-evenly'
      },
      desktopHiddenFullscreen: {
        display: width > 600 ? 'flex' : 'none',
      },
      desktopHiddenBorder: {
        display: width > 600 ? 'flex' : 'none',
        height: '50%',
        justifyContent: 'space-evenly',
        borderWidth: 1,
        borderColor: 'rgb(232,232,232)',
        borderRadius: 10,
        padding: 15
      },
      iconRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      },
      iconSelection: {
        fontSize: 20
      },
});
