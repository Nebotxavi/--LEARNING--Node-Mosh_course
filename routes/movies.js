const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  return res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  return res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  try {
    const { title, numberInStock, dailyRentalRate } = req.body;
    const { _id, name } = genre;

    let movie = new Movie({
      title,
      numberInStock,
      dailyRentalRate,
      genre: { _id, name }
    });
    movie = await movie.save();
    return res.send(movie);
  } catch (ex) {
    return res.send("Movie not saved due to: ", ex);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const { title, numberInStock, dailyRentalRate } = req.body;
  const { _id, name } = genre;

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title,
      numberInStock,
      dailyRentalRate,
      genre: { _id, name }
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("No movie with the given ID was found.");
  return res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const genre = await Movie.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("No movie with the given ID was found.");

  return res.send(genre);
});

module.exports = router;
