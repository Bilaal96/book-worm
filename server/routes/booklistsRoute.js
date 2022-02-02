/** CORE FUNCTIONALITY
 * --- BookList(s)
 * Create single (id is generated by DB)
 * Get ALL existing BookLists in Collection
 * Get single by id
 * Update single by id -> details like title and description 
 * Delete single by id
 
 * --- Book
 * Create/Post/add to an existing BookList
 *? Get single by id
 * Delete single by id
 
 *! What are my DB models/schema for BookList & Books?
 
 *! How are the respective collections structured in the DB? What is their relationship?
    - are they independent collections, using IDs as reference/lookup/foreign key
    - are they dependent - i.e. Books are nested in BookLists -> WARNING:  WILL INTRODUCE DUPLICATE DATA 
 
 *! How will all the books be stored in the DB 
 *! How am I going to fetch all the books in a list
    - I will store bookId's
    - bookId's can be retrieved and used to make BATCH of fetch calls to the Books API -> to get the actual book data

    - OR I can also store collection of Books in DB, whenever a user adds the book to a BookList -> essentially a cache of user-added books
    - then use bookId's to lookup the book in the Books collection
    - if the bookId does not exist in the Book collection, fetch it from the Books API and add it to the Books Collection
 */
import { Router } from "express";

import booklistsController from "../controllers/booklistsController.js";
import handleBooklistError from "../middleware/handleBooklistError.js";

// NOTE: All endpoint paths below are prefixed with "/booklists"
const router = Router();

// ----- booklists -----
// Create a new booklist
router.post("/", booklistsController.create_booklist_post);
// Get all booklists
router.get("/", booklistsController.all_booklists_get);

// --- Single booklist ---
//! DELETION TBD
//! -- not currently necessary but could be useful for future development
//! -- accessible via client state from previous requests
// Get meta-data for a single booklist (id, name, description, booklist array)
router.get("/:listId", (req, res, next) => {});

// TODO
// Update (or edit) a single booklist's details (name, description)
router.put("/:listId", (req, res, next) => {});

// Delete a single booklist (implicitly deletes all books in the list)
router.delete("/:listId", booklistsController.booklist_by_id_delete);

// ----- Book(s) in a single booklist -----
//! DELETION TBD
//! -- not currently necessary but could be useful for future development
//! -- accessible via client state from previous requests
// Get all books in a single booklist
router.get("/:listId/books", (req, res, next) => {});

// Update a booklists' books array with a new book object
// NOTE: although we're "adding" a book to a booklist, we use a PUT request because we're UPDATING the books property of a booklist
router.put("/:listId/books", booklistsController.add_book_to_booklist_put);

//! DELETION TBD
//! -- not currently necessary but could be useful for future development
//! -- accessible via client state from previous requests
// Get a single book from a booklist
router.get("/:listId/books/:bookId", (req, res, next) => {});

// Delete a single book from a booklist
router.delete(
    "/:listId/books/:bookId",
    booklistsController.remove_book_from_booklist_delete
);

// Handle booklist-specific errors
router.use(handleBooklistError);

export default router;
