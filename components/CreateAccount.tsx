import { Text, View, TextInput, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

export default function SignIn({ setLoginToggle }: { setLoginToggle: (value: boolean) => void }) {
    const [email, setEmail] = useState<string>(''); // Initialize with an empty string
    const [userName, setUsername] = useState<string>(''); // Initialize with an empty string
    const [password, setPassword] = useState<string>(''); // Initialize with an empty string

    return (
        <View style={styles.page}>
            <View style={styles.wide}>
                <TextInput
                    placeholderTextColor={'rgb(140, 138, 143)'}
                    placeholder='Username'
                    style={styles.loginInput}
                    value={userName}
                    onChangeText={setUsername} // Updates username state
                />
                <TextInput
                    placeholderTextColor={'rgb(140, 138, 143)'}
                    placeholder='Email'
                    style={styles.loginInput}
                    value={email}
                    onChangeText={setEmail} // Updates email state
                />
                <TextInput
                    placeholderTextColor={'rgb(140, 138, 143)'}
                    placeholder='Password'
                    style={styles.loginInput}
                    value={password}
                    onChangeText={setPassword} // Updates password state
                    secureTextEntry // Hides password input
                />
            </View>
            <View style={styles.wide}>
                <Pressable style={styles.button}><Text style={styles.buttonText}>Create Account</Text></Pressable>
                <Text style={styles.gray}>Or</Text>
                <Pressable onPress={() => { setLoginToggle(true) }}><Text style={styles.blueText}>Login</Text></Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: '#f8f8f8',
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
