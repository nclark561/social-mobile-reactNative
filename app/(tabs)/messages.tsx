import { StyleSheet, Button } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText"; 
import Header from "@/components/Header";


export default function messages() {

  return (
    <ThemedView>
        <Header name='Messages'/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
});
