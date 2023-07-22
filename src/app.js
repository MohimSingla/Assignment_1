const express = require('express');
const {router} = require('../routes/routes.js');

const app = express();

app.use(router);

app.listen(3000, (error) => {
    if(error)
    {
        throw new Error(error)
    }
})