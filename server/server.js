import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

// App Configuration
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ! Routes -> SPLIT INTO SEPARATE FILES
// Test server connection
app.get("/test", (req, res) => {
    res.status(200).json({ success: `Test endpoint hit` });
});

//? REF: https://opensource.com/article/20/11/top-level-await-javascript
app.get("/", async (req, res) => {
    // returns undefined if "search" is not specified
    console.log({ reqQuerySearch: req.query.search });

    // Check if Client sent a Search Term
    // If Search Term received, use it to make a request to the Books API
    if (req.query.search) {
        // Build request endpoint
        const { BOOKS_API_KEY } = process.env;
        const booksSearchEndpoint = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            req.query.search
        )}&key=${BOOKS_API_KEY}`;

        // Fetch books from Books API using the above endpoint
        try {
            const response = await fetch(booksSearchEndpoint);

            console.log({
                "isOK?": response.ok,
                STATUS: response.status,
            });

            // STATUS >= 200 && < 300 ?
            if (response.ok) {
                // parse response as JSON object
                const books = await response.json();
                console.log({ books });

                // respond to client
                res.status(response.status).json(books);
            } else {
                /**
                 * ! THROWING ERRORS:
                 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
                 *! https://rollbar.com/guides/javascript/how-to-throw-exceptions-in-javascript/

                 *? CUSTOM ERROR with STATUS CODE
                 * https://www.codegrepper.com/code-examples/javascript/throw+error+with+status+code+javascript
                 */
                throw Error(
                    `Failed to fetch resource, STATUS: ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
        }
    }
});

// Listen for connection on specified port
const PORT = process.env.PORT || 5000;

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Server is running on Port: ${PORT}`);
});
