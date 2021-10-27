import { Router } from "express";
import fetch from "node-fetch";

// Utils
import getURIEncodedQueryString from "../utils/get-uri-encoded-query-string.js";
import ApiError from "../utils/ApiError.js";

const router = Router();

// Get books based on user search term
router.get("/", async (req, res, next) => {
    const { search: searchTerm, maxResults, startIndex } = req.query;
    console.log("Query params:", req.query);

    // No searchTerm, cannot make request, throw 400 error
    if (!searchTerm) next(ApiError.badRequest("No search term provided"));

    // searchTerm received
    // Build request url for books using query parameters
    const queryString = getURIEncodedQueryString({
        q: searchTerm,
        startIndex,
        maxResults,
    });

    const booksSearchUrl = `https://www.googleapis.com/books/v1/volumes?${queryString}&key=${process.env.BOOKS_API_KEY}`;

    // Fetch books from Books API using the above url
    try {
        const response = await fetch(booksSearchUrl);

        // Check if response status' ok (i.e. within success range or not)
        if (!response.ok) {
            // HTTP status range: 400-500
            // Catch-block will intercept this ApiError instance
            throw ApiError.badRequest(
                `${response.statusText} (${response.status}) - ${response.url}`
            );
        }

        // HTTP status range: 200-300 (within success range)
        // Parse response as JSON object
        const books = await response.json();
        console.log("Books Found?", books.items ? true : false);

        // Fetch successful, respond to client
        if (books.items?.length) {
            // books found
            res.status(response.status).json(books);
        } else {
            // No books found
            throw ApiError.notFound(
                "Not Found (404) - No books found that match the search criteria"
            );
        }
    } catch (err) {
        // Forward error to apiErrorHandler middleware
        next(err);
    }
});

// Get single book by route param (i.e. req.params.bookId)
router.get("/:bookId", async (req, res, next) => {
    const { bookId } = req.params;

    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.BOOKS_API_KEY}`
        );

        if (!response.ok) {
            throw ApiError.notFound(
                `Not Found (404) - Could not find book with ID: ${bookId}`
            );
        }

        const book = await response.json();
        console.log({ book });

        res.status(response.status).json(book);
    } catch (err) {
        next(err);
    }
});

export default router;