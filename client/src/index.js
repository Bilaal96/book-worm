import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import theme from "config/mui-theme";
import AuthProvider from "contexts/auth/auth.provider";
import App from "./App";

ReactDOM.render(
    // <React.StrictMode>
    <Router>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </Router>,
    // </React.StrictMode>,
    document.getElementById("root")
);
