import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import * as path from "path";

// Routes
import booksRoute from "./routes/booksRoute.js";
import authRoute from "./routes/authRoute.js";
import booklistsRoute from "./routes/booklistsRoute.js";

// Middleware
import handleCustomError from "./middleware/handleCustomError.js";
import { verifyAccessToken } from "./middleware/authMiddleware.js";

// App Configuration
import "./config/init_redis.js";
const PORT = process.env.PORT || 5000; // get/define PORT to listen for req on
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        // Set appropriate headers
        credentials: true, // Access-Control-Allow-Credentials
        origin: "http://localhost:3000", // Access-Control-Allow-Origin
    })
);
app.use(cookieParser());

// Serve Static Client Files => ONLY in Production Env
if (process.env.NODE_ENV === "production") {
    // Allow static files to be served from: __dirname/client/build
    app.use(express.static(path.join(__dirname, "client/build")));

    // Serve index.html for any incoming HTTP GET Request
    // -- all static files are built into small modules/packages from index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}

// Create MongoDB Connection String
const { MONGO_USER, MONGO_SECRET } = process.env;
const DB_URI = `mongodb+srv://${MONGO_USER}:${encodeURIComponent(
    MONGO_SECRET
)}@cluster0.bihot.mongodb.net/book-worm?retryWrites=true&w=majority`;

// Establish connection with DB
mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("Connection with MongoDB established");
        // Only listen for requests once DB connection is established
        app.listen(PORT, (error) => {
            if (error) throw error;
            console.log(`Server is running on Port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
        throw err;
    });

// Test server connection / protected route
app.get("/test", verifyAccessToken, (req, res) => {
    const { accessToken, decodedToken } = req;
    console.log("ACCESS VERIFIED:", { accessToken, decodedToken });
    res.status(200).json({ success: `Test endpoint hit` });
});

// Routes
app.use("/books", booksRoute);
app.use("/auth", authRoute);
app.use("/booklists", verifyAccessToken, booklistsRoute);

// Custom Error Handler
app.use(handleCustomError);

// Catch-all error handler
// Will execute for Network Errors
// i.e. when there is no communication between server and Books API
app.use((err, req, res, next) => {
    res.status(500).send({
        error: {
            status: 500,
            message: "Internal Server Error",
        },
    });
});
