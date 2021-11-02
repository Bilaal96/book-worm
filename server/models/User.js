import mongoose from "mongoose";
import { validate as isEmail } from "email-validator";
import bcrypt from "bcrypt";

/**
 * [auto-gen id]
 * firstName
 * lastName
 * email
 * password
 * createdAt (Schema option -> { timestamps: true })
 */
const userSchema = new mongoose.Schema(
    {
        // name: Possibly add maxlength SchemaType option
        // https://mongoosejs.com/docs/guide.html#virtuals
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
            // custom validator - checks for valid email format using email-validator package
            validate: [isEmail, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            // ? Subject to change; may also include custom validation function
            minlength: [6, "Password must include at least 6 characters"],
        },
    },
    { timestamps: true } // auto-generates createdAt & updatedAt properties
);

// 'save' hook is fired on User.create()
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

const User = mongoose.model("user", userSchema);

export default User;
