import { router } from "expo-router";
import { useContext } from "react";
import MyContext from "@/components/providers/MyContext";
import { useFocusEffect } from "expo-router";

export default function Page() {
  const context = useContext<any>(MyContext);
  const { loggedIn } = context

  useFocusEffect(() => {
    if (loggedIn) {
      router.push('/(tabs)');
    } else {
      router.push('/login');
    }
  });

  return <></>
}

