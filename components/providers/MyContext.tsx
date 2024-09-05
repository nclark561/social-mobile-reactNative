import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface UserContextType {
    myInfo: {
        id: string;
        email: string;
        bio: string;
        followers: string[];
        following: string[];
        username: string;
    };
    setLoginToggle: React.Dispatch<React.SetStateAction<boolean>>;
}


const MyContext = createContext<UserContextType | undefined>(undefined);

const initialMyInfo = {
    myInfo: {
        id: "",
        email: "",
        bio: "",
        followers: [],
        following: [],
        username: "",
    },
};


export const MyProvider = ({ children }: { children: ReactNode }) => {
    const [myInfo, setMyInfo] = useState(initialMyInfo.myInfo);
    const [loginToggle, setLoginToggle] = useState(false);

    useEffect(() => {
        getUser();
    }, [loginToggle]);


    const getUser = async () => {
        try {
            const userEmail = await AsyncStorage.getItem("user");
            console.log(userEmail, 'this is user email')
            const email = JSON.parse(userEmail);
            const result = await fetch(
                `https://engaged-rattler-correctly.ngrok-free.app/api/myInfo?email=${email}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const userInfo = await result.json();
            setMyInfo(userInfo.Hello);            
        } catch (error) {
            console.log(error, 'this is the create user error');
        }
    };



    return (
        <MyContext.Provider value={{ myInfo, setLoginToggle: setLoginToggle }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContext;
