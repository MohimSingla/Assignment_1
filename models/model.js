const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connecting with already running MongoDB Database.
mongoose.connect('mongodb://localhost:27017/BookStore');

// Book Schema to define the structor of the Book's data.
// Fields include: title, author, genre, price and stock.
// Corresponding validators by using validator library are applied to check the quality of data that gets stored in the database.
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

// User Schema to define structure of a user entry.
// Fields include userName (should be a valid email address), password, role of the user(either customer or admin), tokens list.
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
    },
    roleName: {
     type: String,
     trim: true,
     require: true,
     validate(value) {
        //  if(value.trim() != "customer".trim() || value != "admin")
        //  {
        //      throw new Error("'RoleName' of a user can either be a 'customer' or an 'admin'. (Case Sensitive)" );
        //  }
     }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Middleware to run when the request is recieved i.e. before the respond handler runs. 
// Functinality of this middleware is to encrypt the password entered by the user.
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Middleware function to verify the user crentials entered by the user while Logging In. 
// Use the bcrypt library to decrypt the hashed password stored into the database and match with the password entered by the user.
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

// Function to generate the JWT token for the user when the user is being created. 
// Usage:- Used as a Bearer OAuth token while accessing various API endpoints.
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString(), roleName: user.roleName }, 'generateJsonToken');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

const User = mongoose.model('users', userSchema);
const Book = mongoose.model('Books', bookSchema);

module.exports = {User, Book};


// Skeleton to create a new user.

// const tempUser = new User({
//     userName: "customer4@gmail.com",
//     password: "test123",
//     roleName: 'customer'
// })

// tempUser.generateAuthToken();


//Skeleton to create the book entry (For testing Purposes ONLY)
// const temp = new Book({
//     title: "Emma",
//     author: "Jane Austen",
//     genre:"Classic",
//     price: 156,
//     stock: 12
// });

// temp.save();