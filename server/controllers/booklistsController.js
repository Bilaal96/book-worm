import Booklist from "../models/Booklist.js";
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
            bookIds: [],
            bookCount: 0,
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

        // Get all booklists that contain a reference to userId
        const booklists = await Booklist.find({ userId });
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

export default {
    create_booklist_post,
    all_booklists_get,
    booklist_by_id_delete,
};
