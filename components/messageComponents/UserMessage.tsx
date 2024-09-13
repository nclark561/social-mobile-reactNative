import { getBackgroundColorAsync } from "expo-system-ui"
import { ThemedText } from "../ThemedText"
import { ThemedView } from "../ThemedView"
import { StyleSheet } from "react-native"
import { useColorScheme } from "react-native"
import { useContext } from "react"
import MyContext from "../providers/MyContext"

interface UserMessageProps {
    username: string,
    message: string
}

const UserMessage = ({username, message}: UserMessageProps) => {
  const colorScheme = useColorScheme()
  const backgroundColor = colorScheme === 'dark' ? '#525252' : "#bebebe"
  const context = useContext<any>(MyContext) 
  const { myInfo } = context
  const isOutMessage = myInfo?.username === username 

  return (
    <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        {isOutMessage && <ThemedView style={{width: 5}}></ThemedView>}
        <ThemedView style={[isOutMessage ? styles.outMessage : [styles.inMessage, { backgroundColor }]]}>
         <ThemedText style={isOutMessage && { color: 'white' }}>{message}</ThemedText>
        </ThemedView>
    </ThemedView>
  )
}

export default UserMessage

const styles = StyleSheet.create({
    outMessage: {
        backgroundColor: "#26a7de",
        borderRadius: 25,
        borderBottomRightRadius: 3,
        padding: 10,
        margin: 10,
        maxWidth: '65%',
    },
    inMessage: {
        borderRadius: 25,
        borderBottomLeftRadius: 3,
        padding: 10,
        margin: 10,
        maxWidth: '65%'
    }
})