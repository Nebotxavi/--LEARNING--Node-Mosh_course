const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      }
    })
  },
  customer: {
    type: new mongoose.Schema({
      isGold: { type: Boolean, default: false },
      name: { type: String, required: true, minlength: 5, maxlength: 50 },
      phone: { type: String, required: true, minlength: 9, maxlength: 50 }
    })
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = new mongoose.model("Rental", rentalSchema);

function rentalValidate(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = rentalValidate;
