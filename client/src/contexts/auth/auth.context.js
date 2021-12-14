import { createContext } from "react";

// Create AuthContext with default values to fallback on
export const AuthContext = createContext({
    accessToken: null,
    setAccessToken: () => {},
    user: null,
    setUser: () => {},

    authenticate: () => {},
    logout: () => {},
});

AuthContext.displayName = "AuthContext";
