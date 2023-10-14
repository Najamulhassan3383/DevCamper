const errorHandler = require("../middleware/error");

const ErrorResponse = require("../utils/errorResponse");

const Users = require("../models/Users");

class AuthRoutes {
  //@desc Register user
  //@route POST /api/v1/auth/register
  //@access Public
  register(req, res, next) {
    const { name, email, password, role } = req.body;

    //create a user
    Users.create({
      name,
      email,
      password,
      role,
    })
      .then((user) => {
        res.status(200).json({ success: true });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = AuthRoutes;
