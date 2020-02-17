const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 255 },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = new mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(255)
      .required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
