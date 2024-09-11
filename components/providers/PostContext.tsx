import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../../components/Supabase";

type PostContextType = {
    getUserPosts: (id: string) => Promise<void>;
    getForYouPosts: () => Promise<void>;
    posts: any[];
    forYouPosts: any[];
    forYouPostsToggle: boolean;
    setForYouPostsToggle: (value: boolean) => void
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [forYouPosts, setForYouPosts] = useState<any[]>([]);
    const [forYouPostsToggle, setForYouPostsToggle] = useState<boolean>(false);

    useEffect(() => {
        getForYouPosts()
    }, [forYouPostsToggle])

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


    const getForYouPosts = async () => {
        console.log('getting for you posts')
        try {
            const result = await fetch(
                `https://engaged-rattler-correctly.ngrok-free.app/api/getPosts`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const fetchedPosts = await result.json();
            setForYouPosts(fetchedPosts.Posts);
        } catch (error) {
            console.log(error, "this is the get for you posts error");
        }
    };


    return (
        <PostContext.Provider value={{ getUserPosts, posts, getForYouPosts, forYouPosts, forYouPostsToggle, setForYouPostsToggle }}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;
