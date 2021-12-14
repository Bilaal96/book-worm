import { useState, useEffect, useCallback } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { AuthContext } from "./auth.context";

// Provides app with ability to access & update AuthContext
const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);

    // Track "login" state values when updated
    useEffect(
        () => console.log("AUTH CONTEXT:", { accessToken, user }),
        [accessToken, user]
    );

    // Decode (access) token and return user data
    const getUserFromToken = (token) => {
        const decoded = jwt_decode(token);
        return {
            id: decoded.sub,
            email: decoded.email,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
        };
    };

    // Calculate access token's time-to-live
    const getTokenTimeToLive = (token) => {
        if (token === null) return 0;

        const decoded = jwt_decode(token);
        const ttlToken = decoded.exp - decoded.iat;
        return ttlToken;
    };

    // Perform fetch request to renew auth tokens
    const fetchNewAuthTokens = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/refresh", {
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await response.json();

            return data;
        } catch (err) {
            console.error(err);
            return err;
        }
    };

    // Attempts to fetch new authentication tokens
    // Updates authContext on successful token renewal
    const silentlyAuthenticateUser = useCallback(async () => {
        try {
            const data = await fetchNewAuthTokens();
            if (!data.accessToken)
                return console.error("No access (silentlyAuthenticateUser)");
            console.log("Refresh response:", data);

            // Extract user from token
            const refreshedUser = getUserFromToken(data.accessToken);

            // Log user into client app
            setAccessToken(data.accessToken);
            setUser(refreshedUser);
        } catch (err) {
            console.error(err);
        }
    }, []);

    /** ON MOUNT: Attempt to silently authenticate user
     * We only want to silently authenticate if the browser has stored a Refresh Cookie
     * The Refresh Cookie is HTTP-only, so cannot be accessed by React
     * As a workaround, a non-HTTP-only cookie (PERSIST_SESSION) is set alongside the Refresh Cookie; with the same expiration time
     * PERSIST_SESSION only exists when the Refresh Cookie exists & contains NO sensitive data
     * With this, we can test for PERSIST_SESSION on mount, and only attempt silent auth if the cookie exists
     */
    useEffect(() => {
        if (Cookies.get("PERSIST_SESSION")) return silentlyAuthenticateUser();
    }, [silentlyAuthenticateUser]);

    // ON ACCESS TOKEN EXPIRATION: Attempt to silently authenticate user
    useEffect(() => {
        const ttlAccessToken = getTokenTimeToLive(accessToken);
        console.log("Token Time-to-Live", ttlAccessToken);

        // if accessToken exists, ttlAccessToken > 0
        // if accessToken DOES NOT exist, ttlAccessToken === 0
        // As a result, tokenRefreshTimer is only set / cleared if an accessToken exists
        if (ttlAccessToken > 0) {
            const tokenRefreshTimer = setInterval(async () => {
                console.log("REFRESH TOKEN ON EXPIRY");
                // No access token means user is not logged in
                // Prevent refresh without accessToken
                if (accessToken) silentlyAuthenticateUser();
            }, ttlAccessToken * 1000);
            return () => clearInterval(tokenRefreshTimer);
        }
    }, [accessToken, silentlyAuthenticateUser]);

    //! Not in use - work in progress
    const login = async (credentials, option = { onSignup: false }) => {
        try {
            const reqUrl = option.onSignup ? "auth/signup" : "auth/login";
            console.log("authContext.login reqUrl:", reqUrl);

            const response = await fetch(
                // `http://localhost:5000/auth/${reqUrl}`,
                "http://localhost:5000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache", //! NEEDED?
                    },
                    credentials: "include", //! NEEDED?
                    body: JSON.stringify(credentials),
                }
            );
            const data = await response.json();

            // return form errors if any
            if (data.errors) return data.errors;

            // extract user from token
            const user = getUserFromToken(data.accessToken);
            console.log("USER FROM TOKEN", user);

            //log user into client app
            setAccessToken(data.accessToken);
            setUser(user);

            // null indicates no form errors
            return null;
        } catch (err) {
            console.err(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken,
                getUserFromToken,
                // TODO
                login,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
