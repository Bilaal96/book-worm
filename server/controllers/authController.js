// User Model
import User from "../models/User.js";

const signup_post = async (req, res, next) => {
    console.log("--- signup ---");
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        res.status(201).send(`User created; ID: ${user._id}`);
    } catch (err) {
        console.log(err.message);
        console.log(err.name);
        next(err);
    }
};

const login_post = async (req, res, next) => {
    console.log("--- login ---");
    const { email, password } = req.body;

    res.send("endpoint hit: login_post");
};

export default {
    signup_post,
    login_post,
};
