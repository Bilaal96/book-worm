import { useContext } from "react";
import { Route, Redirect } from "react-router";

import { AuthContext } from "contexts/auth/auth.context";

const ProtectedRoute = ({ children, ...otherProps }) => {
    const { auth } = useContext(AuthContext);

    return (
        <Route {...otherProps}>
            {auth.isAuthenticated ? (
                children
            ) : (
                <Redirect
                    to={{ pathname: "/login", state: { isProtected: true } }}
                />
            )}
        </Route>
    );
};

export default ProtectedRoute;
