const errorHandler = require("../middleware/error");

const ErrorResponse = require("../utils/errorResponse");

const Course = require("../models/Users");

class AuthRoutes {
  //@desc Register user
  //@route POST /api/v1/auth/register
  //@access Public
  register(req, res, next) {
    res.status(200).json({
      success: true,
    });
  }
}

module.exports = AuthRoutes;
