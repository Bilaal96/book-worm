import { createContext } from "react";

// Create AuthContext with default values to fallback on
export const AuthContext = createContext({
    auth: { user: null, isAuthenticated: false },
    setAuth: () => {},
});

AuthContext.displayName = "AuthContext";
