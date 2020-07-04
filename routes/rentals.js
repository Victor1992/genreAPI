const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(custrentalsomers);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('Resource not found');

    res.send(rental);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const customer = Customer.findById(req.body.id);
    if (!customer) return res.status(400).send('Invalid Customer');

    const movie = Movie.findById(req.body.id);
    if (!movie) return res.status(400).send('Invalid Movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    rental = await rental.save();
    movie.numberInStock--;
    movie.save()
    res.send(rental);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const rental = await Rental.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!rental) return res.status(404).send("The course with given id is not availaible");

    res.send(rental);

});


router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental) return res.status(404).send("The course with given id is not found");

    res.send(rental);

});




module.exports = router;
