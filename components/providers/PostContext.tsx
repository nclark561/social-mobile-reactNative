import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";47
import { Platform } from "react-native";

type PostContextType = {
  getUserPosts: (email: string, userId: string) => Promise<void>;
  getForYouPosts: () => Promise<void>;
  getAllForYouPosts: () => Promise<void>;
  posts: any;
  forYouPosts: any[];
  forYouPostsToggle: boolean;
  setForYouPostsToggle: (value: boolean) => void;
  getBaseUrl: () => void;
  forYouFollowingPosts: any[];
  setForYouPosts: any;
  
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [forYouFollowingPosts, setForYouFollowingPosts] = useState<any[]>([]);
  const [forYouPosts, setForYouPosts] = useState<any[]>([]);
  const [forYouPostsToggle, setForYouPostsToggle] = useState<boolean>(false);

  const getBaseUrl = () => {
    if (Platform.OS === "web") {
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        return process.env.EXPO_PUBLIC_LOCAL_PYTHON_BASE_URL; // local
      } else {
        // Prod for web
        return process.env.EXPO_PUBLIC_PROD_SERVER_BASE_URL; // Use production env variable
      }
    } else {
      // (iOS/Android)
      return process.env.EXPO_PUBLIC_SERVER_BASE_URL;
    }
  };

  useEffect(() => {
    getAllForYouPosts();
    getForYouPosts()
  }, [forYouPostsToggle]);

  const getUserPosts = async (email: string, userId: string) => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getMyPosts?email=${email}&id=${userId}`,
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

  const getForYouPosts = async (userId?: string) => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getPosts${userId ? `?id=${userId}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const fetchedPosts = await result.json();
      setForYouFollowingPosts(fetchedPosts.Posts);
    } catch (error) {
      console.log(error, "this is the get for you posts error");
    }
  };

  const getAllForYouPosts = async () => {
    try {
      const result = await fetch(`${getBaseUrl()}/api/posts/getPosts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const fetchedPosts = await result.json();
      setForYouPosts(fetchedPosts.Posts);
    } catch (error) {
      console.log(error, "this is the get for you posts error");
    }
  };

  return (
    <PostContext.Provider
      value={{
        getUserPosts,
        posts,
        getForYouPosts,
        getAllForYouPosts,
        forYouPosts,
        forYouPostsToggle,
        setForYouPostsToggle,
        getBaseUrl,
        setForYouPosts,
        forYouFollowingPosts,        
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
