import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../../components/Supabase";

type PostContextType = {
    getUserPosts: (id: string) => Promise<void>;
    posts: any[]; // Adjust type based on your actual data structure
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<any[]>([]);


    // const createPost = async (
    //     content: string,
    // ) => {
    //     try {
    //         const test = await fetch("https://engaged-rattler-correctly.ngrok-free.app/api/createPost", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 content
    //             }),
    //         });
    //     } catch (error) {
    //         console.log(error, "this is the create user error");
    //     }
    // };


    const getUserPosts = async (email: string) => {        
        try {
            const result = await fetch(
                `https://engaged-rattler-correctly.ngrok-free.app/api/getMyPosts?email=${email}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const fetchedPosts = await result.json();                        
            setPosts(fetchedPosts); 
        } catch (error) {
            console.log(error, "this is the get user error");
        }
    };


    const getForYouPosts = async (id: string) => {
        try {
            const result = await fetch(
                `http://localhost:3000/api/getMyPosts?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const fetchedPosts = await result.json();
            setPosts(fetchedPosts); // Update state with fetched posts
        } catch (error) {
            console.log(error, "this is the get for you posts error");
        }
    };


    return (
        <PostContext.Provider value={{ getUserPosts, posts }}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;
