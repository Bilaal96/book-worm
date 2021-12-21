import mongoose from "mongoose";

const booklistSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        // Primitive Array - https://mongoosejs.com/docs/schematypes.html#arrays
        bookIds: [String],
    },
    { timestamps: true }
);

const Booklist = mongoose.model("booklist", booklistSchema);

export default Booklist;
