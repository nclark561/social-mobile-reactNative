import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../../components/Supabase";

const PostContext = createContext(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState()


    const createPost = async (
        content: string,
    ) => {
        try {
            const test = await fetch("https://engaged-rattler-correctly.ngrok-free.app/api/createPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content
                }),
            });
        } catch (error) {
            console.log(error, "this is the create user error");
        }
    };


    return (
        <PostContext.Provider value={{}}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;
