const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/BookStore');

const bookSchema = new Schema({
   title: {
    type: String,
    trim: true,
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
    trim: true,
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
    trim: true,
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
        trim: true,
        unique: true,
        lowercase: true,
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
        trim: true,
        require: true,
        validate(value){
            if(value.length < 6)
            {
                throw new Error("Warning! Password must be atleast 6 characters long!");
            }
        }
    }
});

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.statics.findByCredentials = async (userName, password) => {
    const currentUser = await User.findOne({ userName });

    if (!currentUser) {
        throw new Error('Invalid Username. Unable to Login!');
    }

    const flagPassword = await bcrypt.compare(password, currentUser.password);

    if (!flagPassword) {
        throw new Error('Warning! Username-Password mismatch. Unable to Login!');
    }

    return currentUser;
}

const User = mongoose.model('users', userSchema);
const Book = mongoose.model('Books', bookSchema);

module.exports = {User, Book};


// const tempUser = new User({
//     userName: "temp@gmail.com",
//     password: "dwdghj"
// })

// tempUser.save();


// const temp = new Book({
//     title: 2,
//     author: "b",
//     genre:"c",
//     price: 8,
//     stock: 3
// });

// temp.save();