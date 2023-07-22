const express = require('express');

const router = new express.Router();

router.post('/auth/login', (req, res) => {
    res.send("User Authentication")
})

router.post('/books' , (req, res) => {
    res.send("post req books");
})

router.get('/books', (req, res) => {
    res.send("hey good progress");
})

router.get('/books/:id', (req, res) => {
    res.send("Individual book")
})

router.put('/books/:id', (req, res) => {
    res.send("Update Function")
})

router.delete('/books/:id', (req, res) => {
    res.send("Delete operation")
})

module.exports = {router};