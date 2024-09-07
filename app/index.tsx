import { Redirect } from "expo-router";
import { useContext } from "react";
import MyContext from "@/components/providers/MyContext";

export default function Page() {
  const context = useContext<any>(MyContext);
  const { loggedIn } = context

  return (
    loggedIn ? <Redirect href='/(tabs)/index'/> : <Redirect href='/login'/>
  );
}

