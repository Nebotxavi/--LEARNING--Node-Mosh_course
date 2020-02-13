const Joi = require("joi");
const mongoose = require("mongoose");

const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 255,
    required: true
  },
  numberInStock: { type: Number, min: 0, max: 100, required: true },
  dailyRentalRate: { type: Number, min: 0, max: 100, required: true },
  genre: { type: genreSchema, required: true }
});

const Movie = new mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(255)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(100)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
  };
  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
exports.movieSchema = movieSchema;
