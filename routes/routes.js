const express = require('express');
const { User, Book } = require('../models/model.js');
const {adminAuth, checkUserLoginStatus} = require('../middleware/middleware.js');
const {joiSchemaBooksValidator, joiSchemaUserValidator} = require('../validators/joiValidator.js');
const { registerUser, userLogin } = require('../controller/userController.js');
const { getBooks, getBookWithId, saveBookData, updateBookData, deleteBookData, buyBook } = require('../controller/booksController.js');

const router = new express.Router();

// Route at POST to create new user accounts.
// Validators in place to check quality of the data entered.
router.post('/auth/register', registerUser);

// Route at POST "/auth/login" allows the user to login with correct Username(Email) and password.
// Throws 400 http status in case of mismatching credentials.
router.post('/auth/login', userLogin);

// Route at POST "/books" allows only the ADMIN user account to create book entries.
router.post('/books', adminAuth, saveBookData);

// Route at GET "/books" allows any Loged In user to view the listed books data.
router.get('/books', checkUserLoginStatus, getBooks);

// Route at GET "/books/:id" allows any Loged In user to view the book data with the requested ID.
router.get('/books/:id', checkUserLoginStatus, getBookWithId)

// Route at PUT "/books/:id" allows only the ADMIN user to update book data with the requested ID.
router.put('/books/:id', adminAuth, updateBookData)

// Route at DELETE "/books/:id" allows only the ADMIN user to delete book data completely from the data base with the requested ID.
router.delete('/books/:id', adminAuth, deleteBookData)

// Route at GET "/buy/book/:id" allows loggedIn user to buy a book which is available in the inventory. 
router.get('/buy/book/:id', checkUserLoginStatus, buyBook);

module.exports = {router};