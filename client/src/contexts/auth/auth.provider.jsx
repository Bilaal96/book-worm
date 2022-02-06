import { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

// Context
import { AuthContext } from "./auth.context";

// Provides app with ability to access & update AuthContext
const AuthProvider = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
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

            if (!response.ok && response.status !== 401) {
                const error = await response.json();
                throw error;
            }

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

    /** authenticate()
     * This function handles authentication for both login and signup
     
     * @param { String } authType - accepts "login" or "signup"
     * @param { Object } credentials - object containing user authentication details
     */
    const authenticate = async (authType, credentials) => {
        try {
            if (authType !== "login" && authType !== "signup")
                throw Error(`Invalid endpoint passed as argument: ${authType}`);

            const response = await fetch(
                `http://localhost:5000/auth/${authType}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(credentials),
                }
            );

            // Test for response outside of 200-299 range
            if (!response.ok) {
                const err = await response.json();
                // Return server validation errors (if any)
                if (err.errors) return err.errors;

                // No validation errors, return generic error message
                throw new Error(
                    `Authentication request (of type "${authType}") failed with Status: ${response.status} (${response.statusText})`
                );
            }

            const data = await response.json();

            // No access token was retrieved, throw error
            if (!data.accessToken)
                throw Error(
                    `Access denied, something went wrong during ${authType} attempt`
                );

            // Extract user from token
            const user = getUserFromToken(data.accessToken);
            console.log("USER FROM TOKEN", user);

            // Log retrieved user into app
            setAccessToken(data.accessToken);
            setUser(user);

            // Display welcome notification
            enqueueSnackbar(`Welcome ${user.firstName}! 😊`, {
                variant: "success",
                anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                },
            });

            // null indicates no form errors
            return null;
        } catch (err) {
            // e.g. in case no accessToken is retrieved
            console.error(err);
            return { email: "", password: "Something went wrong, try again" };
        }
    };

    // Handles logging authenticated user out
    const logout = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/logout", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    // no-cache - require validation for resource freshness
                    // If not specified, refresh cookie is not deleted
                    "Cache-Control": "no-cache",
                },
                credentials: "include",
            });

            console.log("Logout HTTP response status:", response.status);

            // Handle successful logout; server responds with 301
            if (response.status === 301) {
                const data = await response.json();
                console.log("LOGOUT SUCCESS:", data.message);

                // Log user out of app
                setAccessToken(null);
                setUser(null);

                // Redirect to /login page
                history.push("/login");

                // Display goodbye notification message
                enqueueSnackbar("Goodbye! See you again soon 👋", {
                    variant: "info",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center",
                    },
                });

                // guard response.ok check below as 301 will trigger it
                return;
            }

            // Throw error if response is not 301 / not within 200-299 range
            if (!response.ok) throw Error(`HTTP Error: ${response.status}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken,
                authenticate,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
