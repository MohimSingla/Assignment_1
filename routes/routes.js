const express = require('express');
const { User, Book } = require('../models/model.js')

const router = new express.Router();

router.post('/auth/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password);
        res.send({ user });
    } catch (error) {
        res.status(400).send("Invalid Request!");
    }
})

router.post('/books' , async (req, res) => {
    try{
        const bookData = await new Book(req.body);
        await bookData.save();
        res.send("Book data saved successfully.");
    }
    catch(error){
        res.status(500).send(error.message);
    }
})

router.get('/books', async (req, res) => {
    try{
        const booksData = await Book.find();
        res.send(booksData);
    }
    catch(error){
        res.status(404).send("Invalid Request");
    }
})

router.get('/books/:id', async (req, res) => {
    try{
    const _id = req.params.id;
    const bookData = await Book.findById(_id);
    if(!bookData){
        throw new Error("Book with the requested ID not found.");
    }
    res.send(bookData);
    }
    catch(error){  
        res.status(404).send(error.message);
    }    
})

router.put('/books/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const updatedData = await Book.findOneAndUpdate({_id}, req.body, { runValidators: true, new: true });
        if(!updatedData){
            throw new Error("Book with the entered ID not found. Kindly try again with correct Information.");
        }
        res.send(updatedData);
    }
    catch(error){
        res.status(500).send(error.message);
    }
})

router.delete('/books/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        await Book.deleteOne({_id});
        res.send("Requested Book data deleted successfully.");
    }
    catch(error){
        res.send("Unable to delete the requested book. Kindly verify the entered details or Please try again later if the error still persists!");
    }
})

module.exports = {router};