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
    setLoginToggle: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean;
    updateUser: (links: string, email: string, location: string, bio?: string, username?: string, following?: string[]) => Promise<void>;
    getUser: () => Promise<void>;
    updateFollowers: (
        followeeId: string,
        followerId: string,
        followers: string[],
        following: string[]
    ) => Promise<void>;  // Add updateFollowers to the UserContextType interface
}

const MyContext = createContext<UserContextType | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
    const [myInfo, setMyInfo] = useState<MyInfo>();
    const [loginToggle, setLoginToggle] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        getSession();
    }, [loggedIn, loginToggle]);

    async function getSession() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                setLoggedIn(false);
                return null;
            }
            setLoggedIn(true);
            return data;
        } catch (err) {
            console.error('Unexpected error:', err);
            return null;
        }
    }

    const getUser = async () => {
        try {
            const userEmail = await AsyncStorage.getItem("user");
            if (!userEmail) throw new Error('User not logged in');
            const email = JSON.parse(userEmail);  
            console.log(email, 'this is the email')         
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
            console.log(userInfo, 'user info ')
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
        <MyContext.Provider value={{ myInfo, setLoginToggle, loggedIn, updateUser, getUser, updateFollowers }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContext;
