const { Book } = require('../models/model.js');
const { Sentry } = require('../sentry/sentry.js');
const { joiSchemaBooksValidator } = require('../validators/joiValidator.js');
const got = require('got');

// Response handler which allows only the ADMIN user account to create book entries.
// If any "customer" account tries to access the endpoint, it throws an error.
const saveBookData = async (req, res) => {
    logger.info("POST /books called by user.")
    try{
        const errCheck = joiSchemaBooksValidator.validate(req.body).error;
        if(errCheck) {
            logger.error("Invalid data entered by the user.")
            throw new Error(errCheck);
        };
        const bookData = await new Book(req.body);
        logger.info("Saving bookdata into the database.")
        await bookData.save();
        logger.info("Sending 200 http status code back to user.")
        res.send("Book data saved successfully.");
    }
    catch(error){
        Sentry.captureException(error);
        logger.fatal(error.message, "Encountered some error.")
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
    logger.info("GET /books called by user.")
    const limit =2;
    let page = Number(req.query.page) - 1 || 0;
    try{
        const pageCount = Math.floor((await Book.countDocuments({}) + 1)/limit);
        if(pageCount < page + 1 )
        {
            logger.error("Invalid data requested by the user.")
            throw new Error("Total number of pages currently are: " + pageCount + ". Kindly access any page number lower than that.")
        }
        logger.info("Fetching books data from the database.")
        const booksData = await Book.find().sort({title: 'asc'}).limit(limit).skip(limit*page);
        if(!booksData.length)
        {
            res.send("No books data found.");
        }
        logger.info("Sending Books data back to user with 200 status code.")
        res.send({booksData, "Page Number": page + 1, "Total Pages": pageCount});
    }
    catch(error){
        Sentry.captureException(error);
        logger.fatal(error.message, "Some error occured.")
        res.status(400).send({error: "Invalid Request => " + error.message});
    }
};


// Response handler to allow any Loged In user to view the book data with the requested ID.
// If a user with invalid/no_JWT tries to access the data, he/she is not allowed and served with an error.
const getBookWithId = async (req, res) => {
    logger.info("GET /books/:id called by the user.")
    try{
    const _id = req.params.id;
    const bookData = await Book.findById(_id);
    if(!bookData){
        logger.error("Invalid/non-existing ID entered by the user.")
        throw new Error("Book with the requested ID not found.");
    }
    logger.info("Sending 200 success code with relevant data.")
    res.send(bookData);
    }
    catch(error){  
        Sentry.captureException(error);
        logger.fatal(error.message, "Some error occured.")
        res.status(400).send({error: error.message});
    }    
};

// Response handler which allows only the ADMIN user to update book data with the requested ID.
const updateBookData = async (req, res) => {
    logger.info("PUT /books/:id called by the user.")
    try{
        const _id = req.params.id;
        const updatedData = await Book.findOneAndUpdate({_id}, req.body, { runValidators: true, new: true });
        if(!updatedData){
            logger.error("Invalid/non-existing book id entered by the user.")
            throw new Error("Book with the entered ID not found. Kindly try again with correct Information.");
        }
        logger.info("Sending 200 status code.")
        res.send(updatedData);
    }
    catch(error){
        Sentry.captureException(error);
        logger.fatal(error.message, "Some error encountered.")
        res.status(400).send({error: error.message});
    }
};

// Response handler which allows only the ADMIN user to delete book data completely from the data base with the requested ID.
const deleteBookData = async (req, res) => {
    logger.info("DELETE /books/:id called by the user.")
    try{
        const _id = req.params.id;
        await Book.findByIdAndDelete({_id});
        logger.info("Sending 200 status code with relevant success message to the user.")
        res.send("Requested Book data deleted successfully.");
    }
    catch(error){
        Sentry.captureException(error);
        logger.fatal("Some error encountered.")
        res.status(400).send({error: "Unable to delete the requested book. Kindly verify the entered details or Please try again later if the error still persists!"});
    }
};

//Response handler which allows loggedin user to purchase a book.
const buyBook = async (req, res) => {
    logger.info("POST /buy/book/:id called by the user.")
    try{
        const _id = req.params.id;
        const bookData = await Book.findById(_id);
        if(!bookData)
        {
            logger.error("Invalid book requested by the user.")
            throw new Error("No such book found.");
        }
        if(!bookData.stock)
        {
            logger.error("Requested Book is out of stock.")
            throw new Error("Requested Book is currently out of stock.");
        }
        req.body.amount = bookData.price;
        const paymentData = await got.post('https://stoplight.io/mocks/skeps/book-store:master/12094368/misc/payment/process', {
            json: req.body,
            responseType: 'json'
	    });
        logger.info("Payment successfull.")
        const updatedData = await Book.findOneAndUpdate({_id}, {stock: bookData.stock - 1}, { new: true });
        res.send(paymentData.body);
    }
    catch(error){
        Sentry.captureException(error);
        logger.fatal(error.message, "Some error encountered.")
        res.status(400).send({error: error.message});
    }
}

module.exports = { getBooks, getBookWithId, saveBookData, updateBookData, deleteBookData, buyBook }