import { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

// Context
import { AuthContext } from "./auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import ConfirmActionModal from "components/ConfirmActionModal/ConfirmActionModal";
import { Typography } from "@material-ui/core";

import { BOOK_WORM_API_URI } from "constants/index.js";

// Provides app with ability to access & update AuthContext
const AuthProvider = ({ children }) => {
    const { clearMasterList } = useContext(MasterListContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();

    const [authInProgress, setAuthInProgress] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // Track auth state values when updated
    useEffect(
        () => authInProgress && console.log("AUTH IN PROGRESS"),
        [authInProgress]
    );
    useEffect(() => console.log("USER:", user), [user]);

    // Decode access token and return user data
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
            const response = await fetch(
                `${BOOK_WORM_API_URI}/api/auth/refresh`,
                {
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // required to send refresh cookie
                }
            );

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

    /** silentlyAuthenticateUser
     * Attempts to fetch new authentication tokens
     * Called on app mount & on access token expiration
     * Updates authContext on successful token renewal
     */
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

    // Clear user data (i.e. log them out) from client application
    const clearUserState = useCallback(() => {
        setAccessToken(null);
        setUser(null);
        clearMasterList();
        closeSnackbar(); // Clear any prior notification(s)
    }, [clearMasterList, closeSnackbar]);

    /**
     * ----- PERSIST_SESSION Cookie Explained -----
     * We only want to silently authenticate if the browser has stored a Refresh Cookie
     * The Refresh Cookie is HTTP-only, so cannot be accessed by React
     * As a workaround, a non-HTTP-only cookie (PERSIST_SESSION) is set alongside the Refresh Cookie; with the same expiration time
     * PERSIST_SESSION contains NO sensitive data & only exists when the Refresh Cookie exists
     */
    // Determine whether to re-authenticate user or log user out
    const handleAuthTokenExpiration = useCallback(async () => {
        if (Cookies.get("PERSIST_SESSION")) {
            // Access token expired, refresh token is valid
            // Request new auth tokens to persist user
            silentlyAuthenticateUser();
        } else {
            // Refresh token is invalid, log user out of app
            clearUserState();

            // Redirect to /login page & display modal with message to user
            history.push("/login", { sessionExpired: true });
            setOpenModal(true);
        }
    }, [silentlyAuthenticateUser, clearUserState, history]);

    // ON MOUNT: only attempt silent auth if PERSIST_SESSION Cookie exists
    useEffect(() => {
        if (Cookies.get("PERSIST_SESSION")) return silentlyAuthenticateUser();
    }, [silentlyAuthenticateUser]);

    /** Renew auth tokens when Access Token (AT) expires
     * For a valid AT, this effect sets a timer/interval (which ends when AT expires)
     * At the end of the interval if a valid Refresh Token:
        - exists -> the Access Token is renewed and the timer is reset
        - DOES NOT exist -> the user is logged out
     */
    useEffect(() => {
        const ttlAccessToken = getTokenTimeToLive(accessToken);

        /**
         * if accessToken exists, ttlAccessToken > 0
         * if accessToken DOES NOT exist, ttlAccessToken === 0
         * As a result, tokenRefreshTimer is only set if a VALID accessToken exists (i.e. the token has not expired)
         */
        if (ttlAccessToken > 0) {
            // const refreshInterval = 6 * 1000; //! TESTING ONLY
            const refreshInterval = ttlAccessToken * 1000;
            const tokenRefreshTimer = setInterval(
                handleAuthTokenExpiration,
                refreshInterval // determines when to call handleAuthTokenExpiration
            );

            // Stop tokenRefreshTimer
            return () => clearInterval(tokenRefreshTimer);
        }
    }, [accessToken, handleAuthTokenExpiration]);

    /** authenticate()
     * This function handles authentication for both login and signup
     
     * @param { String } authType - accepts "login" or "signup"
     * @param { Object } credentials - object containing user authentication details
     */
    const authenticate = async (authType, credentials) => {
        try {
            if (authType !== "login" && authType !== "signup")
                throw Error(
                    `Invalid authType passed on authentication attempt: ${authType}`
                );

            setAuthInProgress(true); // init loading state

            // Clear masterList from localStorage
            // Prevents data of previous user (who did not MANUALLY log out) from merging with current user's data
            clearMasterList();

            // Send authentication request with user credentials
            const response = await fetch(
                `${BOOK_WORM_API_URI}/api/auth/${authType}`,
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
                if (err.errors) {
                    setAuthInProgress(false); // end loading state
                    return err.errors;
                }

                // Authentication failed, return generic error message
                throw new Error(
                    `Authentication request (${authType}) failed with Status: ${response.status} (${response.statusText})`
                );
            }

            const data = await response.json();
            setAuthInProgress(false); // end loading state

            // No access token was retrieved, throw error
            if (!data.accessToken)
                throw Error(
                    `Access denied, something went wrong during ${authType} attempt`
                );

            // Authentication successful, extract user data from token
            const userData = getUserFromToken(data.accessToken);

            // Log retrieved user into app
            setAccessToken(data.accessToken);
            setUser(userData);

            // Display welcome notification
            enqueueSnackbar(`Welcome ${userData.firstName}! 😊`, {
                variant: "success",
                anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                },
            });

            // null indicates no form errors
            return null;
        } catch (err) {
            // Return generic form error
            // e.g. in a case where no accessToken is retrieved
            setAuthInProgress(false); // end loading state
            console.error(err);
            return { email: "", password: "Something went wrong, try again" };
        }
    };

    // Handles logging authenticated user out
    const logout = async () => {
        try {
            setAuthInProgress(true); // init loading state

            const response = await fetch(
                `${BOOK_WORM_API_URI}/api/auth/logout`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                        // no-cache - require validation for resource freshness
                        // If not specified, refresh cookie is not deleted
                        "Cache-Control": "no-cache",
                    },
                    // required to remove refreshToken from Redis whitelist
                    credentials: "include",
                }
            );

            console.log("Logout HTTP response status:", response.status);

            // Handle successful logout; server responds with 301
            if (response.status === 301) {
                const data = await response.json();
                console.log("LOGOUT SUCCESS:", data.message);

                // Log user out of app
                clearUserState();
                setAuthInProgress(false); // end loading state

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
            setAuthInProgress(false); // end loading state

            // Display goodbye notification message
            enqueueSnackbar(
                "Logout failed 🤔. If this problem persists please try again later.",
                {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center",
                    },
                }
            );
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
                authInProgress,
            }}
        >
            {/* On refresh token expiration, display modal to notify user that their "session" has ended */}
            <ConfirmActionModal
                title="🔒 Session Expired"
                openModal={openModal}
                setOpenModal={setOpenModal}
                buttons={{
                    positive: { hide: true },
                    negative: { text: "Close" },
                }}
            >
                <Typography
                    style={{ fontSize: "18px", padding: "14px 28px" }}
                    variant="body1"
                >
                    You were automatically logged out because your session has
                    expired. Please log back in to continue.
                </Typography>
            </ConfirmActionModal>

            {/* Render children */}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
