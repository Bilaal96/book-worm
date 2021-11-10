import mongoose from "mongoose";
import { validate as isEmail } from "email-validator";
import bcrypt from "bcrypt";

/** User Doc Outline
 * [auto-gen id]
 * firstName
 * lastName
 * email
 * password
 * createdAt (via Schema option -> { timestamps: true })
 * updatedAt (via Schema option -> { timestamps: true })
 */
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
        },
        email: {
            type: String,
            required: [true, "Please enter an email"],
            unique: true,
            lowercase: true,
            // validate email format
            validate: [isEmail, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            minlength: [6, "Password must include at least 6 characters"],
        },
    },
    { timestamps: true } // auto-generates createdAt & updatedAt properties
);

/** Mongoose Hooks Middleware
 * User.create() method triggers the 'save' hook (internally)
 * We can use pre-save & post-save hooks to execute logic before and after the User.create() method
 
 * In the pre-save hook below, we are hashing the password entered by the user BEFORE we create the User document
 * In the post-save hook, we're simply logging the newly created User document
 */
userSchema.pre("save", async function (next) {
    console.log("Hashing:", this);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.post("save", async function (doc, next) {
    console.log("New user saved:", doc);
    next();
});

// Custom static login function
userSchema.statics.login = async function (email, password) {
    // Find a user in db with submitted email
    // Returns null if user does not exist
    // NOTE: 'this' keyword refers to User model instance
    const user = await this.findOne({ email });

    // Authenticate user - compare submitted password with stored password
    if (user) {
        const isAuthenticated = await bcrypt.compare(password, user.password);
        console.log("isAuthenticated", isAuthenticated);

        // Credentials match, return user, otherwise throw error
        if (isAuthenticated) return user;

        throw Error("incorrect password");
    }

    throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);

export default User;
