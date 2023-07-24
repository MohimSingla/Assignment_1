const express = require('express');
const {router} = require('../routes/routes.js');

const app = express();

// To Parse incomming requests body data into JSON
app.use(express.json());

// Middleware to incorporate API endpoints
app.use(router);

// Starting up Express Server with error handling
app.listen(3000, (error) => {

    if(error)
    {
        throw new Error(error)
    }
})

