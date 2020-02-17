const auth = require("../middleware/auth");
// const asyncMiddleware = require("../middleware/async");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

const { Genre, validate } = require("../models/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("genre");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    res.send(genre);
  } catch (err) {
    return res.status(404).send("No genre with the given ID was found.");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name
  });
  await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name
      },
      { new: true }
    );
    res.send(genre);
  } catch (ex) {
    return res.status(404).send("No genre with the given ID was found.");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("No genre with the given ID was found.");

  res.send(genre);
});

module.exports = router;
