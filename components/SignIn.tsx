import { Text, View, TextInput, StyleSheet, Pressable } from 'react-native';

export default function SignIn({ setLoginToggle }: { setLoginToggle: (value: boolean) => void }) {
    return (
        <View style={styles.page}>
            <View style={styles.wide}>
                <TextInput placeholderTextColor={'rgb(140, 138, 143)'} placeholder='Username' style={styles.loginInput} />
                <TextInput placeholderTextColor={'rgb(140, 138, 143)'} placeholder='Password' style={styles.loginInput} />
            </View>
            <View style={styles.wide}>
                <Pressable style={styles.button}><Text style={styles.buttonText}>Sign In</Text></Pressable>
                <Text style={styles.gray}>Or</Text>
                <Pressable onPress={() => { setLoginToggle(false) }}><Text style={styles.blueText}>Create Account</Text></Pressable>
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
        color: ' rgb(63, 134, 196)',
        paddingTop: 5
    }
});
