const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://localhost:27017/BookStore');

const bookSchema = new Schema({
   title: {
    type: String,
    require: true,
    validate(value) {
        if(validator.isEmpty(value, { ignore_whitespace: true }))
        {
            throw new Error("Title of the book cannot be Empty.");
        }
    }
   },
   author: {
    type: String,
    require: true,
    validate(value) {
        if(validator.isEmpty(value, { ignore_whitespace: true }))
        {
            throw new Error("Author of the book cannot be Empty.");
        }
    }
   },
   genre: {
    type: String,
    require: true,
    validate(value) {
        if(validator.isEmpty(value, { ignore_whitespace: true }))
        {
            throw new Error("Genre of the book cannot be Empty.");
        }
    }
   },
   price: {
    type: Number,
    require: true,
    validate(value) {
        if(value<0)
        {
            throw new Error("Price of the book should be greater than or equal to '0'.");
        }
        
    }

   },
   stock: {
    type: Number,
    require: true,
    validate(value) {
        if(value<0)
        {
            throw new Error("Books quantity should be greater than '0'.");
        }
    }
   }
});

const userSchema = new Schema({
    userName: {
        type: String,
        require: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Warning! Please provide a valid Email Address!");
            }
        }
    },
    password: {
        type: String, 
        require: true,
        validate(value){
            if(value.length < 6)
            {
                throw new Error("Warning! Password must be atleast 6 characters long!");
            }
        }
    }
});


const User = mongoose.model('users', userSchema);
const Book = mongoose.model('Books', bookSchema);

module.exports = {User, Book};


// const tempUser = new user({
//     userName: "temp",
//     password: "dwd"
// })

// tempUser.save();


// const temp = new book({
//     title: 2,
//     author: "b",
//     genre:"c",
//     price: 8,
//     stock: 3
// });

// temp.save();