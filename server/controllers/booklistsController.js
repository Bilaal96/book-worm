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

const booklist_by_id_delete = async (req, res, next) => {
    try {
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;
        // ID of booklist - sent as URL parameter
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

//! ADDING/DELETING BOOK: https://mongoosejs.com/docs/documents.html#updating-using-save
// https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
// https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
// https://mongoosejs.com/docs/api.html#model_Model.updateOne --> does not return doc
// ? updateOne vs findOneAndUpdate
// https://stackoverflow.com/questions/36209434/use-cases-for-updateone-over-findoneandupdate-in-mongodb#:~:text=findOneAndUpdate%20returns%20a%20document%20whereas,bit%20of%20time%20and%20bandwidth.
//? Add to beginning of mongoose array
// https://mongoosejs.com/docs/api/array.html#mongoosearray_MongooseArray-unshift
// https://stackoverflow.com/questions/28360526/mongoose-unshift-findandupdatebyid
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

export default {
    create_booklist_post,
    all_booklists_get,
    booklist_by_id_delete,
    add_book_to_booklist_put,
};
