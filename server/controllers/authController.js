// User Model
import User from "../models/User.js";

const signup_post = async (req, res, next) => {
    console.log("--- signup ---");
    const { fname, lname, email, password } = req.body;

    try {
        const user = await User.create({
            name: { first: fname, last: lname },
            email,
            password,
        });
        console.log("User created:", user);

        res.send("endpoint hit: signup_post");
    } catch (err) {
        console.log(err.message);
        res.json(err);
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
