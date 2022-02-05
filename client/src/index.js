import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";

import theme from "config/mui-theme";
import AuthProvider from "contexts/auth/auth.provider";
import App from "./App";

ReactDOM.render(
    // <React.StrictMode>
    <Router>
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </SnackbarProvider>
        </ThemeProvider>
    </Router>,
    // </React.StrictMode>,
    document.getElementById("root")
);
