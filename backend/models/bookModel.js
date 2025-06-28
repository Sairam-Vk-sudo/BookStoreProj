import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    publishedDate: {
        type: Date,
        required: true
    },
    addedBy:{
        type: String,
    }
}, {
    timestamps: true
});

export const Book = mongoose.model("Book", bookSchema);

