import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, ReactNode, useEffect } from "react";
import { useContext } from "react";
import MyContext from "./MyContext";
import { Platform } from "react-native";
// import { post } from "../utils/fetch";

interface ContextProps {
  person: string;
  setPerson: (value: string) => void;
  myConvos: {
    id: string;
    me: string;
    recipient: string;
    roomName: string;
    date: string;
  }[];
  getConvos: () => void;
  deleteConvos: (id: string) => void;
  addMessage: (id: string, conversationId: string, message: string) => void;
}

const MessageContext = createContext<ContextProps>({
  person: "",
  setPerson: () => {},
  myConvos: [],
  getConvos: () => {},
  deleteConvos: () => {},
  addMessage: () => {},
});

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  // const [myUsername, setMyUsername] = useState<string | null>(
  //   localStorage.getItem("user"),
  // );
  const [person, setPerson] = useState<string>("");
  const [myConvos, setMyConvos] = useState<any[]>([]);
  const [convoId, setConvoId] = useState<any[]>([]);

  const { myInfo } = useContext<any>(MyContext);

  const getBaseUrl = () => {
    if (Platform.OS === "web") {
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        return process.env.EXPO_PUBLIC_LOCAL_SERVER_BASE_URL; // local
      } else {
        // Prod for web
        return process.env.EXPO_PUBLIC_PROD_SERVER_BASE_URL; // Use production env variable
      }
    } else {
      //(iOS/Android)
      return process.env.EXPO_PUBLIC_SERVER_BASE_URL;
    }
  };

  const getConvos = async () => {
    try {
      const convos = await fetch(
        `${getBaseUrl()}/conversations/getConvos?user_id=${myInfo?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userInfo = await convos.json();
      setMyConvos([...userInfo]);
    } catch (error) {
      console.log(error, "this is the gete convos error");
    }
  };

  const deleteConvos = async (id: string) => {
    console.log(id, "hitting delete convo");
    try {
      await fetch(`${getBaseUrl()}/conversations/delete`, {
        method: "POST",
        body: JSON.stringify({
          conversation_id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      getConvos();
    } catch (error) {
      console.log(error, "this is the delete error");
    }
  };

  const addMessage = async (
    conversationId: string,
    message: string,
    id: string,
  ) => {
    try {
      const response = await fetch(`${getBaseUrl()}/conversations/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          messages: message,
          user_id: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Message added successfully:", data);

      getConvos(); // Call the getConvos function to update the conversation data
    } catch (error) {
      console.log(error, "this is the add message error");
    }
  };

  return (
    <MessageContext.Provider
      value={{
        person,
        setPerson,
        myConvos,
        getConvos,
        deleteConvos,
        addMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
