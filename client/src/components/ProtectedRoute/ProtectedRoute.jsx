import { useContext } from "react";
import { Route, Redirect } from "react-router";

import { AuthContext } from "contexts/auth/auth.context";

const ProtectedRoute = ({ children, isLoggedIn, ...otherProps }) => {
    const auth = useContext(AuthContext);

    /** Memory leak warning cause and solution
     *! ProtectedRoute isLoggedIn causes Warning, covered in this article:
     * https://medium.com/@shanplourde/avoid-react-state-update-warnings-on-unmounted-components-bcecf054e953
     * https://www.debuggr.io/react-update-unmounted-component/
     
     * Updating auth.user results in unmounting of Child component (i.e. "children" prop)
     * Async processes affecting internal state of the Child component (such as setState) 
       must complete execution BEFORE the Child unmounts -> to prevent memory leak
     * If a memory leak occurs, a warning is displayed in the console
     
     * To resolve this warning, any state updates for "children" (i.e. component passed as child) must occur before updating auth.user
     * e.g. in SignUpForm & LoginForm components -> clear form fields BEFORE updating auth.user & auth.accessToken
     */

    // Protected from logged in user
    // e.g. Logged in user, should not be able to Login / Signup again
    if (isLoggedIn) {
        return (
            <Route {...otherProps}>
                {auth.user ? (
                    <Redirect
                        to={{
                            pathname: "/manage-lists",
                        }}
                    />
                ) : (
                    children
                )}
            </Route>
        );
    }

    // Protected from guest user
    return (
        <Route {...otherProps}>
            {!auth.user ? (
                <Redirect
                    to={{ pathname: "/login", state: { isProtected: true } }}
                />
            ) : (
                children
            )}
        </Route>
    );
};

export default ProtectedRoute;
