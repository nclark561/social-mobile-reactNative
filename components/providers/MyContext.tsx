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
    myInfo: MyInfo | undefined
    setLoginToggle: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean;
    updateUser: (links: string, email: string, location: string, bio?: string, username?: string, following?: string[]) => Promise<void>;
}

const MyContext = createContext<UserContextType | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
    const [myInfo, setMyInfo] = useState<MyInfo>();
    const [loginToggle, setLoginToggle] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false)



    useEffect(() => {
        getUser();
        getSession()
    }, [loginToggle])


    async function getSession() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                setLoggedIn(false)
                return null;
            }
            setLoggedIn(true)

            return data;
        } catch (err) {
            console.error('Unexpected error:', err);
            return null;
        }
    }


    const getUser = async () => {
        try {
            const userEmail = await AsyncStorage.getItem("user");
            console.log(userEmail, 'this is user email')
            if (!userEmail) throw new Error('User not logged in')
            const email = JSON.parse(userEmail);
            const result = await fetch(
                `https://${process.env.EXPO_PUBLIC_SERVER_BASE_URL}.ngrok-free.app/api/myInfo?email=${email}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(`Status: ${result.status}`);
            const text = await result.text();
            console.log(`Response Text: ${text}`);
            const userInfo = JSON.parse(text);
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
    ) => {
        console.log(bio, 'bio')
        try {
            const bodyData: any = {};

            if (email) bodyData.email = email;            
            if (links) bodyData.links = links;
            if (location) bodyData.location = location;
            if (bio) bodyData.bio = bio;

            const response = await fetch(`http://localhost:3000/api/updateUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const result = await response.json();
            await getUser(); // Refresh the user info after update
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    return (
        <MyContext.Provider value={{ myInfo, setLoginToggle: setLoginToggle, loggedIn, updateUser: updateUser }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContext;
