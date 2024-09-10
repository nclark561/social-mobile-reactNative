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

interface UserContextType {
    myInfo: MyInfo | undefined
    setLoginToggle: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean
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
    
            // Log the status and response text to diagnose the issue
            console.log(`Status: ${result.status}`);
            const text = await result.text();
            console.log(`Response Text: ${text}`);
    
            // Attempt to parse JSON if the content type is correct
            const userInfo = JSON.parse(text);
            console.log(userInfo, 'this is user info')
            setMyInfo(userInfo.Hello);
        } catch (error) {
            console.log(error, 'this is the get user error');
        }
    };
    



    return (
        <MyContext.Provider value={{ myInfo, setLoginToggle: setLoginToggle, loggedIn }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContext;
