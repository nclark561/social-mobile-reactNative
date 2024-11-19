import React, { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../components/Supabase";
import { Platform } from "react-native";

interface MyInfo {
  id: string;
  email: string;
  bio: string;
  followers: string[];
  following: string[];
  username: string;
  blurhash?: string;
}

interface ConversationData {
  id: string;
  date: Date;
  users: UserData[];
  messages: MessageData[];
}

interface User {
  id: string;
  username: string;
}

interface UserData {
  user: User;
}

interface MessageData {
  conversationId: string;
  date: string;
  id: string;
  message: string;
  status: string;
  userName: string;
  recipient?: string;
  time: any;
  userId: string;
}

export interface UserContextType {
  myInfo: MyInfo | undefined;
  myConvos: ConversationData[];
  setMyConvos: React.Dispatch<React.SetStateAction<ConversationData[]>>;
  setLoginToggle: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  updateUser: (
    email: string,
    links?: string,
    location?: string,
    bio?: string,
    color?: string,
  ) => Promise<void>;
  getUser: () => Promise<void>;
  getConvos: () => Promise<void>;
  updateFollowers: (
    myId: string,
    theirId: string,
    theirFollowers: string[],
    myFollowing: string[],
  ) => Promise<void>;
  setMyInfo: any;
}

const MyContext = createContext<UserContextType | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [myInfo, setMyInfo] = useState<MyInfo | undefined>();
  const [myConvos, setMyConvos] = useState<ConversationData[]>([]);
  const [loginToggle, setLoginToggle] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const getBaseUrl = () => {
    if (Platform.OS === "web") {
      return window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
        ? process.env.EXPO_PUBLIC_LOCAL_PYTHON_BASE_URL
        : process.env.EXPO_PUBLIC_PROD_SERVER_BASE_URL;
    } else {
      return process.env.EXPO_PUBLIC_SERVER_BASE_URL;
    }
  };

  useEffect(() => {
    getSession();
  }, [loggedIn, loginToggle]);

  async function getSession() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching session:", error);
        setLoggedIn(false);
        localStorage.removeItem('user')
        return null;
      }
      setLoggedIn(true);
      if (data) {
        getUser();
      }
      return data;
    } catch (err) {
      console.error("Unexpected error:", err);
      return null;
    }
  }

  const getConvos = async () => {
    if (!myInfo?.id) return;
    try {
      const response = await fetch(
        `${getBaseUrl()}/conversations/getConvos?user_id=${myInfo?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversations.");
      }
      const { conversations } = await response.json();
      setMyConvos(conversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  useEffect(() => {
    if (myInfo) {
      getConvos();
    }
  }, [myInfo]);

  const getUser = async () => {
    try {
      let userEmail;
      if (Platform.OS === "web") {
        userEmail = localStorage.getItem("user");
      } else {
        userEmail = await AsyncStorage.getItem("user");
      }
      if (!userEmail) throw new Error("User not logged in");

      const email = JSON.parse(userEmail);
      const result = await fetch(`${getBaseUrl()}/users/myInfo?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) throw new Error("Failed to fetch user info.");
      const userInfo = await result.json();
      console.log(userInfo, "this is user info");
      setMyInfo(userInfo.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setMyInfo(undefined);
    }
  };

  const updateUser = async (
    email: string,
    links?: string,
    location?: string,
    bio?: string,
    color?: string,
  ) => {
    try {
      const bodyData: any = { email, links, location, bio, color };

      const response = await fetch(`${getBaseUrl()}/users/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error("Failed to update user info.");

      await getUser(); // Refresh the user info after update
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const updateFollowers = async (
    myId: string,
    theirId: string,
  ) => {
    try {
      const bodyData = { myId, theirId };      
      const response = await fetch(`${getBaseUrl()}/users/updateFollowing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error("Failed to update followers.");

      await getUser(); // Refresh the user info after update
    } catch (error) {
      console.error("Failed to update followers:", error);
    }
  };

  return (
    <MyContext.Provider
      value={{
        myInfo,
        myConvos,
        setMyConvos,
        setLoginToggle,
        loggedIn,
        setLoggedIn,
        updateUser,
        getUser,
        getConvos,
        updateFollowers,
        setMyInfo,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
