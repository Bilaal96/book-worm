import { Router } from "express";
import booksController from "../controllers/booksController.js";

const router = Router();

// Get books based on user search term
router.get("/", booksController.books_by_search_get);

// Get single book by route param (i.e. req.params.bookId)
router.get("/:bookId", booksController.book_by_id_get);

export default router;
