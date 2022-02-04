// Model
import Booklist from "../models/Booklist.js";

// Utils
import CustomError from "../utils/CustomError.js";

/**
 * Only registered users can perform /booklists actions
 * All /booklists routes receive an accessToken
 * The accessToken is verified by the middleware: verifyAccessToken
 * If valid, verifyAccessToken forwards the accessToken and it's decodedPayload (as decodedToken) to the next middleware in the stack
 */

// ----- Booklists Collection -----
const create_booklist_post = async (req, res, next) => {
    try {
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;
        const { title, description } = req.body;

        // Cleanup description containing ONLY whitespace
        const validDescription =
            description.trim().length > 0 ? description : "";

        // Create booklist
        const newBooklist = await Booklist.create({
            userId, // reference to associated user
            title,
            description: validDescription,
            books: [],
        });

        res.status(201).json(newBooklist);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const all_booklists_get = async (req, res, next) => {
    try {
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;

        // Get all booklists for the user that made the request
        // Sort booklists - most recently updated list appears first
        const booklists = await Booklist.find({ userId }).sort({
            updatedAt: "desc",
        });
        console.log(booklists);

        // Return an array of all booklists found
        res.status(200).json(booklists);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// --- Single Booklist Document ---
const update_booklist_metadata_patch = async (req, res, next) => {
    try {
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;
        // ID of booklist to update - sent as Route parameter
        const { listId } = req.params;
        // Extract new values (input by user) from request body
        const { title, description } = req.body;

        // Cleanup description containing ONLY whitespace
        const validDescription =
            description.trim().length > 0 ? description : "";

        // Query: update & retrieve booklist with _id of "listId"
        // NOTE: Matching userId ensures that only the owner of the booklist can update it
        const query = { _id: listId, userId };
        // Update title and description of booklist found
        const update = {
            title,
            description: validDescription,
        };

        // Find booklist that matches "query" and update it
        // NOTE: validation is handled by booklistSchema
        const updatedBooklist = await Booklist.findOneAndUpdate(query, update, {
            new: true, // Return the updated booklist document
            runValidators: true, // validate fields using Booklist schema
        });

        // Update operation failed
        // Throw error if updatedBooklist does not exist (i.e. is null)
        if (updatedBooklist === null)
            throw CustomError.notFound("Failed to update booklist details");

        console.log("UPDATED BOOKLIST:", updatedBooklist);

        // Send updatedBooklist to client
        res.status(200).json(updatedBooklist);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const booklist_by_id_delete = async (req, res, next) => {
    try {
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;
        // ID of booklist to delete - sent as Route parameter
        const { listId } = req.params;

        // Find and delete the booklist with _id == req.params.listId
        // Returns the deleted booklist if found, otherwise returns null
        const deletedBooklist = await Booklist.findOneAndDelete({
            _id: listId, // identifies target doc for deletion
            userId, // ensures that user trying to delete doc owns it
        });

        // The booklist targetted for deletion does not exist in the DB
        // Or is not owned by user that made the request
        if (deletedBooklist === null)
            throw CustomError.notFound(
                "The booklist you're trying to delete does not exist"
            );

        // Booklist successfully deleted
        console.log("BOOKLIST DELETED:", deletedBooklist);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

// ----- Book(s) in a Single Booklist -----
const add_book_to_booklist_put = async (req, res, next) => {
    try {
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;
        // id of the booklist to add to
        const { listId } = req.params;
        // book that user wants to add to the target booklist
        const { bookToAdd } = req.body;
        console.log({ userId, listId, bookToAdd });

        // Find booklist that user wants to add book to
        const booklistToUpdate = await Booklist.findOne({
            _id: listId, // identifies target doc to update
            userId, // ensures that user trying to update doc owns it
        });

        // Throw error if booklistToUpdate does not exist (i.e. is null)
        // NOTE: null is also returned if malicious user tries to update a list that they do not own
        if (booklistToUpdate === null)
            throw CustomError.notFound(
                "The booklist you're trying to add to does not exist"
            );

        console.log("TARGET LIST:", booklistToUpdate);

        // Prevent user from adding duplicate books to a single list
        if (booklistToUpdate.books.some((book) => book.id === bookToAdd.id))
            throw CustomError.conflict(
                "That book already exists in this booklist"
            );

        // Add book to the beginning of booklist.books array
        booklistToUpdate.books.unshift(bookToAdd);

        // Save the updated booklist document to the DB
        booklistToUpdate
            .save()
            .then((updatedBooklist) => {
                console.log("ADDED BOOK TO:", updatedBooklist);
                res.status(200).json(updatedBooklist);
            })
            .catch((err) => {
                throw err;
            });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const remove_book_from_booklist_delete = async (req, res, next) => {
    try {
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;
        // Route parameters
        const { listId, bookId } = req.params;

        // Query: update & retrieve booklist with _id of "listId"
        // NOTE: Matching userId ensures that only the owner of the booklist can update it
        const query = { _id: listId, userId };
        // From booklist.books array, remove element with id matching: bookId
        const update = { $pull: { books: { id: bookId } } };

        const updatedBooklist = await Booklist.findOneAndUpdate(
            query,
            update,
            { new: true } // Return the updated booklist
        );

        // Update operation failed
        // Throw error if updatedBooklist does not exist (i.e. is null)
        if (updatedBooklist === null)
            throw CustomError.notFound(
                "Failed to delete book from booklist"
                // "The booklist you're trying to update does not exist"
            );

        // Send updateBooklist back to client
        res.status(200).json(updatedBooklist);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export default {
    // Booklist collection
    create_booklist_post,
    all_booklists_get,

    // Booklist document
    update_booklist_metadata_patch,
    booklist_by_id_delete,

    // Book in Booklist document
    add_book_to_booklist_put,
    remove_book_from_booklist_delete,
};
