import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Error Handling Middleware
import apiErrorHandler from "./middleware/api-error-handler.js";

// Routers
import booksRoute from "./routes/books.js";

// App Configuration
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Test server connection
app.get("/test", (req, res) => {
    res.status(200).json({ success: `Test endpoint hit` });
});

// Handle requests to /books routes
app.use("/books", booksRoute);

// Handle errors
app.use(apiErrorHandler);

// Listen for connection on specified port
const PORT = process.env.PORT || 5000;

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Server is running on Port: ${PORT}`);
});
