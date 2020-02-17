const auth = require("../middleware/auth");
const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const router = express.Router();

const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  return res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return req.status(404).send("No rental with the given ID.");
  return req.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  let movie = await Movie.findById(req.body.movieId);
  if (!customer || !movie)
    return res
      .status(400)
      .send("Customer or movie with the given ID not found");

  if (movie.numberInStock <= 0)
    return res.status(400).send("Movie not in stock.");

  const { title, dailyRentalRate } = movie;
  const { isGolden, name, phone } = customer;

  let rental = new Rental({
    movie: {
      _id: movie._id,
      title,
      dailyRentalRate
    },
    customer: {
      _id: customer._id,
      isGolden,
      name,
      phone
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something went wrong...");
  }

  // rental = await rental.save();

  // movie.numberInStock--;
  // await movie.save();

  return res.send(rental);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(400).send("Invalid rental");

  rental.dateReturned = Date.now();

  let movie = await Movie.findById(rental.movie._id);
  movie.numberInStock++;

  await rental.save();
  await movie.save();

  return res.send(rental);
});

module.exports = router;
