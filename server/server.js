import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

// Custom Middleware
import apiErrorHandler from "./middleware/apiErrorHandler.js";

// Routes
import booksRoute from "./routes/booksRoute.js";

// App Configuration
dotenv.config();
const PORT = process.env.PORT || 5000; // get/define PORT to listen for req on
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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

// Handle requests to /books routes
app.use("/books", booksRoute);

// Handle errors
app.use(apiErrorHandler);
