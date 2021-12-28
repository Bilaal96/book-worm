import Booklist from "../models/Booklist.js";
import CustomError from "../utils/CustomError.js";

const create_booklist_post = async (req, res, next) => {
    try {
        // decodedToken is passed via verifyAccessToken middleware
        // Get userId from decodedToken
        const userId = req.decodedToken.sub;
        const { title, description } = req.body;

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

export default {
    create_booklist_post,
};
