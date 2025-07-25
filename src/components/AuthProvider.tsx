// AuthProvider.js
import { auth, db } from "@/firebase";
import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

interface FirestoreUserData {
  id: string;
  role: string;
  email: string;
  clearance:  "All" | "none";
  [key: string]: any;
}


const initialState: {
  user: User | null;
  userData: FirestoreUserData | null;
  loading: boolean;
  cachedAuthState: boolean;
  createUser: (email: string, password: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Partial<FirestoreUserData>) => Promise<void>;
} = {
  user: null,
  userData: null,
  loading: true,
  cachedAuthState: false,
  createUser: async () => { throw new Error("Not implemented"); },
  loginUser: async () => { throw new Error("Not implemented"); },
  logoutUser: async () => { throw new Error("Not implemented"); },
  resetPassword: async () => { throw new Error("Not implemented"); },
  updateUserData: async () => { throw new Error("Not implemented"); },
};

export const AuthContext = createContext<{
  user: User | null;
  userData: FirestoreUserData | null;
  loading: boolean;
  cachedAuthState: boolean;
  createUser: (email: string, password: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Partial<FirestoreUserData>) => Promise<void>;
}>(initialState);

interface Props {
  children: React.ReactNode;
}

const CACHED_USER_KEY = "cached_user_data";
const CACHED_AUTH_KEY = "cached_auth_state";

// Function to get initial state from cache
const getInitialState = () => {
  try {
    const cachedAuth = localStorage.getItem(CACHED_AUTH_KEY);
    const cachedUser = localStorage.getItem(CACHED_USER_KEY);

    if (cachedAuth && cachedUser) {
      const parsedAuth = JSON.parse(cachedAuth);
      const parsedUser = JSON.parse(cachedUser);

      if (
        parsedAuth?.email &&
        parsedUser?.email &&
        parsedAuth.email === parsedUser.email
      ) {
        return {
          user: parsedAuth,
          userData: parsedUser,
          isValid: true,
        };
      }
    }
    return { user: null, userData: null, isValid: false };
  } catch (e) {
    console.error("Error reading initial cache:", e);
    return { user: null, userData: null, isValid: false };
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: Props) => {
  // Get initial state from cache before first render
  const initialState = getInitialState();

  const [initialized, setInitialized] = useState(initialState.isValid);
  const [loading, setLoading] = useState(!initialState.isValid); // Only show loading if no valid cache
  const [user, setUser] = useState<User | null>(initialState.user);
  const [userData, setUserData] = useState<FirestoreUserData | null>(
    initialState.userData
  );
  // Track if we are using cached auth state (offline mode)
  const [cachedAuthState, setCachedAuthState] = useState(initialState.isValid);

  const cacheUserData = (data: FirestoreUserData) => {
    try {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error caching user data:", error);
    }
  };

  const cacheAuthState = (user: User | null) => {
    try {
      if (user) {
        const cachedUser = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        localStorage.setItem(CACHED_AUTH_KEY, JSON.stringify(cachedUser));
      } else {
        localStorage.removeItem(CACHED_AUTH_KEY);
      }
    } catch (error) {
      console.error("Error caching auth state:", error);
    }
  };

  const getCachedUserData = (): FirestoreUserData | null => {
    try {
      const cached = localStorage.getItem(CACHED_USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Error reading cached user data:", error);
      return null;
    }
  };

  const fetchUserData = async (email: string) => {
    try {
      if (!navigator.onLine) {
        const cachedData = getCachedUserData();
        if (cachedData && cachedData.email === email) {
          setUserData(cachedData);
          return cachedData;
        }
        throw new Error("No cached data available offline");
      }

      const RecordCollection = collection(db, "users");
      const recordQuery = query(RecordCollection, where("email", "==", email));
      const querySnapshot = await getDocs(recordQuery);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreUserData[];

      if (fetchedData.length > 0) {
        const userData = fetchedData[0];
        setUserData(userData);
        cacheUserData(userData);
        return userData;
      }

      const cachedData = getCachedUserData();
      if (cachedData && cachedData.email === email) {
        setUserData(cachedData);
        return cachedData;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      const cachedData = getCachedUserData();
      if (cachedData && cachedData.email === email) {
        setUserData(cachedData);
        return cachedData;
      }
      throw error;
    }
  };

  const createUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      cacheAuthState(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Try online login first
      if (navigator.onLine) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        cacheAuthState(result.user);
        const userData = await fetchUserData(email);
        return { result, userData };
      } else {
        // Offline login with cached credentials
        const cachedAuth = localStorage.getItem(CACHED_AUTH_KEY);
        const cachedUser = cachedAuth ? JSON.parse(cachedAuth) : null;
        const cachedData = getCachedUserData();

        if (cachedUser?.email === email && cachedData?.email === email) {
          setUser(cachedUser);
          setUserData(cachedData);
          return { result: { user: cachedUser }, userData: cachedData };
        }
        throw new Error(
          "Cannot login offline without valid cached credentials"
        );
      }
    } catch (error) {
      // If online login fails, try offline login as fallback
      const cachedAuth = localStorage.getItem(CACHED_AUTH_KEY);
      const cachedUser = cachedAuth ? JSON.parse(cachedAuth) : null;
      const cachedData = getCachedUserData();

      if (cachedUser?.email === email && cachedData?.email === email) {
        setUser(cachedUser);
        setUserData(cachedData);
        return { result: { user: cachedUser }, userData: cachedData };
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      // Remove only auth-related data from localStorage
      localStorage.removeItem(CACHED_USER_KEY);
      localStorage.removeItem(CACHED_AUTH_KEY);
      window.location.href = "/"; // Force a full page reload and redirect
    } catch (error) {
      console.error("Logout error:", error);
      throw error; // Propagate the error to be handled by the caller
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // If we have valid cached data, use it for offline mode
        const cachedAuth = localStorage.getItem(CACHED_AUTH_KEY);
        const cachedUser = cachedAuth ? JSON.parse(cachedAuth) : null;
        const cachedData = getCachedUserData();
        if (
          cachedUser?.email &&
          cachedData?.email &&
          cachedUser.email === cachedData.email
        ) {
          setUser(cachedUser);
          setUserData(cachedData);
          setCachedAuthState(true);
          setLoading(false);
          setInitialized(true);
          return;
        }
        // No valid cache, clear state
        if (user || userData) {
          setUser(null);
          setUserData(null);
          localStorage.removeItem(CACHED_USER_KEY);
          localStorage.removeItem(CACHED_AUTH_KEY);
        }
        setCachedAuthState(false);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Only set loading if we need to fetch new data and don't have valid cache
      const cachedData = getCachedUserData();
      const needsFetch = !(
        cachedData?.email &&
        currentUser.email &&
        cachedData.email === currentUser.email
      );

      if (needsFetch && !initialState.isValid) {
        setLoading(true);
        try {
          if (currentUser.email) {
            const userData = await fetchUserData(currentUser.email);
            if (!userData) {
              await signOut(auth);
              setUser(null);
              setUserData(null);
              localStorage.removeItem(CACHED_USER_KEY);
              localStorage.removeItem(CACHED_AUTH_KEY);
              setCachedAuthState(false);
            } else {
              setUser(currentUser);
              setUserData(userData);
              setCachedAuthState(false);
            }
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Use cached data immediately
        setUser(currentUser);
        setUserData(cachedData);
        setCachedAuthState(false);
        setLoading(false);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Only show loading state if we're actually loading and not initialized
  if (loading && !initialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "",
        }}
      >
        <LoadingOutlined style={{ fontSize: 24, color: "white" }} />
      </div>
    );
  }

  const authValue = {
    user,
    userData,
    loading,
    cachedAuthState,
    createUser,
    loginUser,
    logoutUser,
    resetPassword: async () => { throw new Error("Not implemented"); },
    updateUserData: async () => { throw new Error("Not implemented"); },
  };

  // Always provide auth context regardless of state
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};


// PropTypes are not needed in TypeScript, but if you want runtime validation, you can keep them.

export default AuthProvider;
