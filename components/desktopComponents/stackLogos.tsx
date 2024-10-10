import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Platform,
    Image
} from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

export default function StackLogos() {

    if (Platform.OS !== 'web') {
        return null;
    }

    return (
        <ThemedView style={styles.desktopHiddenBorder}>
            <ThemedText style={{ textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Tech Used</ThemedText>
            <ThemedView style={styles.space}>
                <ThemedView style={styles.row}>
                    <Image style={{ width: 60, height: 60, margin: 5 }} source={require('../../assets/logos/ts.png')}></Image>
                    <Image style={{ width: 60, height: 60, margin: 5 }} source={require('../../assets/logos/rn.png')}></Image>
                    {/* <Image style={{ width: 60, height: 60 }}  source={require('../../assets/logos/node.png')}></Image> */}
                    <Image style={{ width: 60, height: 60, margin: 5 }} source={require('../../assets/logos/pg.png')}></Image>
                </ThemedView>
                <ThemedView style={styles.row}>
                    <Image style={{ width: 60, height: 60, margin: 5 }} source={require('../../assets/logos/next.png')}></Image>
                    <Image style={{ width: 60, height: 60, margin: 5 }} source={require('../../assets/logos/expo.png')}></Image>
                    <Image style={{ width: 60, height: 60, margin: 5 }} source={require('../../assets/logos/sb.png')}></Image>
                </ThemedView>
                <Image style={{ width: 50, height: 50 }} source={require('../../assets/logos/prisma.png')}></Image>
            </ThemedView>
        </ThemedView>
        // <ThemedView style={styles.desktopHiddenBorder}>
        //     <ThemedText style={{ textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Other Projects</ThemedText>                        
        //     <View style={styles.videoContainer}>
        //         <iframe
        //             width="100%"
        //             height="315"
        //             src="https://www.youtube.com/embed/nK6ggr6-on0"
        //             title="YouTube video player"
        //             frameBorder="0"
        //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        //             allowFullScreen
        //         ></iframe>
        //     </View>
        // </ThemedView>
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
        padding: 15,
        margin: 10
    },
    videoContainer: {
        marginTop: 10,
        width: '100%',
        aspectRatio: 16 / 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconSelection: {
        fontSize: 20
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 25
    },
    space: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    }
});
