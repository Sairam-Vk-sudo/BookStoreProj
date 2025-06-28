import express from "express";
import { Book } from "../models/bookModel.js"; // Adjust the import path as necessary
import authMiddleware from "../middleware/authMiddleware.js";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/seeBooks", async (req,res) => {
    try{
        const books = await Book.find();
        res.status(200).json(books);
    }
    catch(err) {
        console.error("Error fetching books:", err);
}
})

router.get("/myBooks", authMiddleware, async (req,res,next) => {
    try{
        const username = req.user.username;
        console.log("Fetching books for user:", username);
        const books = await Book.find({ addedBy: username });
        if (books.length === 0) {
            return res.status(404).send("No books found for this user");
        }
        console.group("User's Books:", username);
        console.table(books.map(book => ({
            Title: book.title,
        })))
        res.status(200).json(books);
    }catch (err) {
        console.error("Error fetching user's books:", err);
        return res.status(500).send("Internal Server Error");
    }
})

router.post("/addBook", async (req, res) => {
    try{
        const { title, author, description, publishedDate, addedBy } = req.body;
        if (!title || !author || !description || !publishedDate || !addedBy) {
            return res.status(400).send("All fields are required");
        }
        const newBook = new Book({
            title,
            author,
            description,
            publishedDate: new Date(publishedDate),
            addedBy
        });
        await newBook.save();
        console.log("Book added successfully:", newBook);        
    }
    catch (error) {
        console.error("Error adding book:", error);
        return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Book added successfully");
});

router.get("/seeBook/:id", async (req,res) => {
    const {id} = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send("Book not found");
        }
        res.status(200).json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        return res.status(500).send("Internal Server Error");
    }     
})

router.put("/updateBook/:id", async (req,res) => {
    const {id} = req.params
    const { title, author, description, publishedDate } = req.body;
    try{
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).send("Book not found");
        }
        const updatedBook = await Book.findByIdAndUpdate(id, {
            title,
            author,
            description,
            publishedDate: new Date(publishedDate)
        }, { new: true });
        return res.status(200).json(updatedBook)
    }
    catch (error) {
        console.error("Error updating book:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.delete("/deleteBook/:id", async (req,res) => {
    const {id} = req.params;
    try {
        const book = await Book.findById(id)
        if (!book) {
            return res.status(404).send("Book not found");
        }
        await Book.findByIdAndDelete(id);
        return res.status(200).send("Book deleted successfully");   
    }
    catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).send("Internal Server Error");
    }
})

router.post("/wishlist/:bookId", authMiddleware, async (req, res) => {
    try {
        const { bookId } = req.params;
        const username = req.user.username;

        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if book is already in wishlist
        const bookIndex = user.wishlist.indexOf(bookId);
        let inWishlist = false;

        if (bookIndex > -1) {
            // Remove from wishlist
            user.wishlist.splice(bookIndex, 1);
            inWishlist = false;
        } else {
            // Add to wishlist
            user.wishlist.push(bookId);
            inWishlist = true;
        }

        await user.save();

        return res.status(200).json({
            message: inWishlist ? "Added to wishlist" : "Removed from wishlist",
            inWishlist
        });

    } catch (error) {
        console.error("Error updating wishlist:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add GET route to fetch wishlist
router.get("/wishlist", authMiddleware, async (req, res) => {
    try {
        const username = req.user.username;
        // Use populate to get full book details
        const user = await User.findOne({ username }).populate({
            path: 'wishlist',
            model: 'Book',
            select: 'title author publishedDate description addedBy'
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add debug logs
        console.log('Populated wishlist:', JSON.stringify(user.wishlist, null, 2));

        return res.status(200).json(user.wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;
