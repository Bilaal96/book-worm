import { createContext } from "react";

// Create AuthContext with default values to fallback on
export const AuthContext = createContext({
    accessToken: null,
    setAccessToken: () => {},
    user: null,
    setUser: () => {},
    getUserFromToken: () => {},

    // TODO - work in progress
    // May be able to handle logging in after signup with login() func
    signUp: () => {},
    login: () => {},
    logout: () => {},
});

AuthContext.displayName = "AuthContext";
