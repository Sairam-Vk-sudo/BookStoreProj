import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
// import { PORT, MONGO_URI } from './config.js';
import cors from 'cors';
import mongoose from 'mongoose';
import booksRoute from './routes/bookRoutes.js';
import { User }  from './models/userModel.js';
import bcrypt from 'bcrypt';    
import jwt from 'jsonwebtoken'; 


const app = express();



app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
}   )
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
})

// const User = mongoose.model('User', userSchema);
// const Book = mongoose.model('Book', bookSchema);

app.use("/api", booksRoute);

// const User = userDB.model('User', userSchema);

app.post("/api/register", async (req,res) => {
    const {username, name, email, password} = req.body;
    
    try{
        if (!username || !name || !email || !password) {
        return res.status(400).send("All fields are required");
    }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).send("User already exists");
        }
        const encryptPassword = await bcrypt.hash(password, 10);
        if (!encryptPassword) {
            return res.status(500).send("Error hashing password");
        }
        const newUser = new User({
            username,
            name,
            email,
            password: encryptPassword
        })
        await newUser.save()
        return res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Internal Server Error");
    }
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body
    try{
        if(!email || !password){
            return res.status(400).send("Email and password are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const encryptPassword = await bcrypt.compare(password, user.password);
        if(!encryptPassword){
            return res.status(401).send("Invalid email or password")
        }

        const token = jwt.sign({
            username: user.username,
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: 1000
        });

        return res.status(200).json({
            message: `Login successful, Welcome ${user.username}`,
            token,
            user: {
                username: user.username,
                email: user.email
            }
        })
    } catch(err){
        console.error("Error logging in user:", err);
        return res.status(500).send("Internal Server Error");
    }
})
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})

