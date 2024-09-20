import { Text, View, TextInput, StyleSheet, Pressable, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from './ThemedView';
import { supabase } from "./Supabase";

export default function SignIn({ setLoginToggle }: { setLoginToggle: (value: boolean) => void }) {
    const [email, setEmail] = useState<string>(''); // Initialize with an empty string
    const [userName, setUsername] = useState<string>(''); // Initialize with an empty string
    const [password, setPassword] = useState<string>(''); // Initialize with an empty string
    const colorScheme = useColorScheme()
    const color = colorScheme === 'dark' ? 'white' : 'black'

    const handleSignUp = async (userName: string, email: string) => {
        
        try {
            // const { data, error } = await supabase.auth.signUp({
            //     email: email,
            //     password: password,
            // });
            const result = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/createUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userName,
                    email: email,
                }),
            });
            setLoginToggle(true)

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <ThemedView style={styles.page}>
            <ThemedView style={styles.wide}>
                <TextInput
                    placeholderTextColor={'rgb(140, 138, 143)'}
                    placeholder='Username'
                    style={[styles.loginInput, {color}]}
                    value={userName}
                    onChangeText={setUsername} // Updates username state
                />
                <TextInput
                    placeholderTextColor={'rgb(140, 138, 143)'}
                    placeholder='Email'
                    style={[styles.loginInput, {color}]}
                    value={email}
                    onChangeText={setEmail} // Updates email state
                />
                <TextInput
                    placeholderTextColor={'rgb(140, 138, 143)'}
                    placeholder='Password'
                    style={[styles.loginInput, {color}]}
                    value={password}
                    onChangeText={setPassword} // Updates password state
                    secureTextEntry // Hides password input
                />
            </ThemedView>
            <ThemedView style={styles.wide}>
                <Pressable onPress={() => { handleSignUp(userName, email) }} style={styles.button}><Text style={styles.buttonText}>Create Account</Text></Pressable>
                <Text style={styles.gray}>Or</Text>
                <Pressable onPress={() => { setLoginToggle(true) }}><Text style={styles.blueText}>Login</Text></Pressable>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
        width: "100%"
    },
    loginInput: {
        width: "90%",
        borderRadius: 0,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgb(197, 191, 191)',
        padding: 12,
        marginVertical: 10, // Vertical margin between inputs
    },
    gray: {
        color: 'gray'
    },
    wide: {
        width: "90%",
        alignItems: 'center', // Centers content within this View
        marginBottom: 20, // Adds space between the input group and buttons
    },
    button: {
        backgroundColor: 'rgb(63, 134, 196)',
        borderRadius: 5,
        padding: 10,
        width: "90%",
        alignItems: 'center', // Centers the text within the button
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    blueText: {
        color: 'rgb(63, 134, 196)',
        paddingTop: 5
    }
});
