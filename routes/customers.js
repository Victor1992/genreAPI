const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');

const express = require('express');
const { findLastIndex } = require('underscore');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Genre.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Genre.findById(req.params.id);

    if (!customer) return res.status(404).send('Resource not found');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer = await customer.save()
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!customer) return res.status(404).send("The course with given id is not availaible");

    res.send(customer);

});


router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send("The course with given id is not found");

    res.send(customer);

});




module.exports = router;
