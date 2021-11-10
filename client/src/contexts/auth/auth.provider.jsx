import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";

// Provides app with ability to access & update AuthContext
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        isAuthenticated: false,
    });

    // Log auth value when updated
    useEffect(() => console.log("AUTH CONTEXT", auth), [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
