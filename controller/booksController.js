const { Book } = require('../models/model.js');
const { joiSchemaBooksValidator } = require('../validators/joiValidator.js');
const got = require('got');

// Response handler which allows only the ADMIN user account to create book entries.
// If any "customer" account tries to access the endpoint, it throws an error.
const saveBookData = async (req, res) => {
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
        res.status(400).send({error: error.message});
    }
}

// Response handler which allows any Loged In user to view the listed books data.
// If a user with invalid/no_JWT tries to access the data, he/she is not allowed and served with an error.
// Pagination Applied: User need to send query parameter of page to access the page number.
// Data sent in ascending order, sorted by title.
// User can see the page number he/she requested and total number of pages available.
// If page number requested by user exceeds maximum page limit: Throws an error
const getBooks = async (req, res) => {
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
        res.status(400).send({error: "Invalid Request => " + error.message});
    }
};


// Response handler to allow any Loged In user to view the book data with the requested ID.
// If a user with invalid/no_JWT tries to access the data, he/she is not allowed and served with an error.
const getBookWithId = async (req, res) => {
    try{
    const _id = req.params.id;
    const bookData = await Book.findById(_id);
    if(!bookData){
        throw new Error("Book with the requested ID not found.");
    }
    res.send(bookData);
    }
    catch(error){  
        res.status(400).send({error: error.message});
    }    
};

// Response handler which allows only the ADMIN user to update book data with the requested ID.
const updateBookData = async (req, res) => {
    try{
        const _id = req.params.id;
        const updatedData = await Book.findOneAndUpdate({_id}, req.body, { runValidators: true, new: true });
        if(!updatedData){
            throw new Error("Book with the entered ID not found. Kindly try again with correct Information.");
        }
        res.send(updatedData);
    }
    catch(error){
        res.status(400).send({error: error.message});
    }
};

// Response handler which allows only the ADMIN user to delete book data completely from the data base with the requested ID.
const deleteBookData = async (req, res) => {
    try{
        const _id = req.params.id;
        await Book.findByIdAndDelete({_id});
        res.send("Requested Book data deleted successfully.");
    }
    catch(error){
        res.status(400).send({error: "Unable to delete the requested book. Kindly verify the entered details or Please try again later if the error still persists!"});
    }
};

//Response handler which allows loggedin user to purchase a book.
const buyBook = async (req, res) => {
    try{
        const _id = req.params.id;
        const bookData = await Book.findById(_id);
        if(!bookData)
        {
            throw new Error("No such book found.");
        }
        if(!bookData.stock)
        {
            throw new Error("Requested Book is currently out of stock.");
        }
        req.body.amount = bookData.price;
        const paymentData = await got.post('https://stoplight.io/mocks/skeps/book-store:master/12094368/misc/payment/process', {
            json: req.body,
            responseType: 'json'
	    });
        const updatedData = await Book.findOneAndUpdate({_id}, {stock: bookData.stock - 1}, { new: true });
        res.send(paymentData.body);
    }
    catch(error){
        res.status(400).send({error: error.message});
    }
}

module.exports = { getBooks, getBookWithId, saveBookData, updateBookData, deleteBookData, buyBook }