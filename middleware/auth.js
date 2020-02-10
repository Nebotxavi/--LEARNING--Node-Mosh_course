function authenticate(req, res, next) {
  console.log("Authenticated!");
  next();
}

module.exports = authenticate;
