import mongoose from "mongoose";

/**
 * One-to-many - Data Modelling
 * Embedding - https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/
 * Referencing (or Linking) - https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/
 */
const booklistSchema = new mongoose.Schema(
    {
        // reference to associated user
        userId: {
            type: mongoose.Types.ObjectId,
            required: [true, "A booklist must have an associated user"],
        },
        title: {
            type: String,
            required: [true, "A title is required"],
        },
        description: String,
        // Array of Mixed Types - https://mongoosejs.com/docs/schematypes.html#arrays
        books: [{}],
    },
    { timestamps: true }
);

const Booklist = mongoose.model("booklist", booklistSchema);

export default Booklist;
