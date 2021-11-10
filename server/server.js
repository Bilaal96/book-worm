import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";

// Routes
import booksRoute from "./routes/booksRoute.js";
import authRoute from "./routes/authRoute.js";

// App Configuration
dotenv.config();
const PORT = process.env.PORT || 5000; // get/define PORT to listen for req on
const app = express();

// Middlewares
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
app.use(morgan("dev"));

// Create MongoDB Connection String
const { MONGO_USER, MONGO_SECRET } = process.env;
const dbUri = `mongodb+srv://${MONGO_USER}:${encodeURIComponent(
    MONGO_SECRET
)}@cluster0.bihot.mongodb.net/book-worm?retryWrites=true&w=majority`;

// Establish connection with DB
mongoose
    .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
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

// Test server connection
app.get("/test", (req, res) => {
    res.status(200).json({ success: `Test endpoint hit` });
});

// Routes
app.use("/books", booksRoute);
app.use("/auth", authRoute);

// Catch-all error handler
// Will execute for Network Errors
// i.e. when there is no communication between server and Books API
app.use((err, req, res, next) => {
    res.status(500).send("Internal Server Error: Something went wrong");
});
