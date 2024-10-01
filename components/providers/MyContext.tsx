import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../../components/Supabase";

interface MyInfo {
    id: string;
    email: string;
    bio: string;
    followers: string[];
    following: string[];
    username: string;
}

export interface UserContextType {
    myInfo: MyInfo | undefined;
    myConvos: ConversationData[];
    setMyConvos: React.Dispatch<React.SetStateAction<ConversationData[]>>;  // Add setMyConvos to the UserContextType
    setLoginToggle: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean;
    updateUser: (links: string, email: string, location: string, bio?: string, username?: string, following?: string[]) => Promise<void>;
    getUser: () => Promise<void>;
    getConvos: () => Promise<void>;
    updateFollowers: (
        followeeId: string,
        followerId: string,
        followers: string[],
        following: string[]
    ) => Promise<void>;
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

const MyContext = createContext<UserContextType | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
    const [myInfo, setMyInfo] = useState<MyInfo>();
    const [myConvos, setMyConvos] = useState<ConversationData[]>([]);
    const [loginToggle, setLoginToggle] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        getSession();
    }, [loggedIn, loginToggle]);

    async function getSession() {
        console.log('hitting get session')
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log(error, 'get session error')
                setLoggedIn(false);
                return null;
            }
            console.log(data, 'get session data')
            setLoggedIn(true);
            return data;
        } catch (err) {
            console.error('Unexpected error:', err);
            return null;
        }
    }

    const getConvos = async () => {
        try {
            const convos = await fetch(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/getConvos?id=${myInfo?.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const { conversations } = await convos.json();
            setMyConvos(conversations);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    useEffect(() => {
        getConvos(); 
      }, [myInfo]);


    const getUser = async () => {
        try {
            const userEmail = await AsyncStorage.getItem("user");
            if (!userEmail) throw new Error('User not logged in');
            const email = JSON.parse(userEmail);
            console.log(email, 'this is the email');
            const result = await fetch(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/myInfo?email=${email}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const text = await result.text();
            const userInfo = JSON.parse(text);
            console.log(userInfo, 'user info');
            setMyInfo(userInfo.user);
        } catch (error) {
            console.log(error, 'this is the get user error');
        }
    };

    const updateUser = async (
        email: string,
        links?: string,
        location?: string,
        bio?: string,
        color?: string
    ) => {
        try {
            const bodyData: any = {};
            if (email) bodyData.email = email;
            if (links) bodyData.links = links;
            if (location) bodyData.location = location;
            if (bio) bodyData.bio = bio;
            if (color) bodyData.color = color;

            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/updateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            await response.json();
            await getUser(); // Refresh the user info after update
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    const updateFollowers = async (
        myId: string,
        theirId: string,
        theirFollowers: string[],
        myFollowing: string[]
    ) => {
        try {
            const bodyData: any = {};
            if (myId) bodyData.myId = myId;
            if (theirId) bodyData.theirId = theirId;
            if (theirFollowers) bodyData.theirFollowers = theirFollowers;
            if (myFollowing) bodyData.myFollowing = myFollowing;

            const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/updateUserFollow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            await response.json();
            await getUser(); // Refresh the user info after update
        } catch (error) {
            console.error("Failed to update followers:", error);
        }
    };

    return (
        <MyContext.Provider value={{ myInfo, myConvos, setMyConvos, setLoginToggle, loggedIn, updateUser, getUser, getConvos, updateFollowers }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContext;
