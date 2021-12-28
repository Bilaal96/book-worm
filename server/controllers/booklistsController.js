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

        // Create booklist
        const newBooklist = await Booklist.create({
            userId, // reference to associated user
            title: title,
            description: description ? description : "",
            bookIds: [],
            bookCount: 0,
        });

        res.status(201).json(newBooklist);
    } catch (err) {
        // ! Temporary
        console.error(err);
        next(CustomError.badRequest("Failed to create Booklist"));

        // Check for Mongoose ValidationError (i.e. no title)
        // ! Failed to create: 409 Conflict
        // next(err) //! call this, then check and handle error in middleware
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

export default {
    create_booklist_post,
    all_booklists_get,
};
