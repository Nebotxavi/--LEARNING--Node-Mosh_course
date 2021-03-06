const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

const { validate, Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  return res.send(customers);
});

router.get("/:id", async (req, res) => {
  try {
    customer = await Customer.findById(req.params.id);
    return res.send(customer);
  } catch (ex) {
    res.send("No customer with the given ID was found.");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { isGold, name, phone } = req.body;
    const customer = new Customer({
      isGold,
      name,
      phone
    });
    await customer.save();
    res.send(customer);
  } catch (ex) {
    return res.status(500).send("Something went wrong...");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { isGold, name, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isGold, name, phone },
      { new: true }
    );
    await res.send(customer);
  } catch (ex) {
    res.status(404).send("No customer with the given ID was found");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    res.send(customer);
  } catch (ex) {
    res.status(404).send("No customer with the given ID was found");
  }
});

module.exports = router;
