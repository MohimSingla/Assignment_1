const express = require('express');
const { User, Book } = require('../models/model.js');
const {adminAuth, checkUserLoginStatus} = require('../middleware/middleware.js');
const {joiSchemaBooksValidator, joiSchemaUserValidator} = require('../validators/joiValidator.js')

const router = new express.Router();

// Route at POST to create new user accounts.
// Validators in place to check quality of the data entered.
router.post('/auth/register', async (req, res) => {
    try{
        const errCheck = joiSchemaUserValidator.validate(req.body).error;
        if(errCheck)
        {
            throw new Error(errCheck);
        }
        const userData = new User(req.body);
        await userData.generateAuthToken();
        res.status(200).send("User Created SuccessFully!");
    }
    catch(error){
        res.status(500).send(error.message);
    }
})

// Route at POST "/auth/login" allows the user to login with correct Username(Email) and password.
// Throws 400 http status in case of mismatching credentials.
router.post('/auth/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password);
        res.send({ user });
    } catch (error) {
        res.status(400).send("Invalid Request!");
    }
})

// Route at POST "/books" allows only the ADMIN user account to create book entries.
// If any "customer" account tries to access the endpoint, it throws an error.
router.post('/books', adminAuth, async (req, res) => {
    try{
        const errCheck = joiSchemaBooksValidator.validate(req.body).error;
        if(errCheck) {
            throw new Error(errCheck);
        };
        const bookData = await new Book(req.body);
        await bookData.save();
        res.send("Book data saved successfully.");
    }
    catch(error){
        res.status(500).send(error.message);
    }
})

// Route at GET "/books" allows any Loged In user to view the listed books data.
// If a user with invalid/no_JWT tries to access the data, he/she is not allowed and served with an error.
// Pagination Applied: User need to send query parameter of page to access the page number.
// Data sent in ascending order, sorted by title.
// User can see the page number he/she requested and total number of pages available.
// If page number requested by user exceeds maximum page limit: Throws an error
router.get('/books', checkUserLoginStatus,  async (req, res) => {
    const limit =2;
    let page = Number(req.query.page) - 1 || 0;
    try{
        const pageCount = Math.floor((await Book.countDocuments({}) + 1)/limit);
        if(pageCount < page + 1 )
        {
            throw new Error("Total number of pages currently are: " + pageCount + ". Kindly access any page number lower than that.")
        }
        const booksData = await Book.find().sort({title: 'asc'}).limit(limit).skip(limit*page);
        if(!booksData.length)
        {
            res.send("No books data found.");
        }
        res.send({booksData, "Page Number": page + 1, "Total Pages": pageCount});
    }
    catch(error){
        res.status(404).send("Invalid Request => " + error.message);
    }
})

// Route at GET "/books/:id" allows any Loged In user to view the book data with the requested ID.
// If a user with invalid/no_JWT tries to access the data, he/she is not allowed and served with an error.
router.get('/books/:id', checkUserLoginStatus, async (req, res) => {
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

// Route at PUT "/books/:id" allows only the ADMIN user to update book data with the requested ID.
router.put('/books/:id', adminAuth, async (req, res) => {
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

// Route at DELETE "/books/:id" allows only the ADMIN user to delete book data completely from the data base with the requested ID.
router.delete('/books/:id', adminAuth, async (req, res) => {
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