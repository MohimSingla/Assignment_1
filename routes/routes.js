const express = require('express');
const { User } = require('../models/model.js')

const router = new express.Router();

router.post('/auth/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password);
        res.send({ user });
    } catch (e) {
        res.status(400).send("Invalid Request!");
    }
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