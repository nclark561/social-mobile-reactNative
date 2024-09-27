import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, ReactNode, useEffect } from "react";
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
  addMessage: (
    id: string,
    conversationId: string,
    message: string,    
  ) => void;
}

const MessageContext = createContext<ContextProps>({
  person: "",
  setPerson: () => { },
  myConvos: [],
  getConvos: () => { },
  deleteConvos: () => { },
  addMessage: () => { },
});

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  // const [myUsername, setMyUsername] = useState<string | null>(
  //   localStorage.getItem("user"),
  // );
  const [person, setPerson] = useState<string>("");
  const [myConvos, setMyConvos] = useState<any[]>([]);
  const [convoId, setConvoId] = useState<any[]>([]);


  const getConvos = async () => {
    try {
      const convos = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getConvos?email=${AsyncStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userInfo = await convos.json();
      setMyConvos([...userInfo.Posts]);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const deleteConvos = async (id: string) => {
    console.log(id, 'hitting delete convo')
    try {
      await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/deleteConvo`, {
        method: "POST",
        body: JSON.stringify({
          id: id,
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
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,            
          messages: message,
          id,          
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Message added successfully:", data);

      getConvos(); // Call the getConvos function to update the conversation data
    } catch (error) {
      console.log(error, "this is the create user error");
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
