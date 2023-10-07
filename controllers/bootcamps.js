// Desc: Controller for bootcamps

const Bootcamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");

class BootcampsRoutes {
  // @desc Get all bootcamps
  //@route GET /api/v1/bootcamps
  //@access Public
  getBootcamps(req, res, next) {
    Bootcamp.find()
      .then((bootcamps) => {
        res.status(200).json({
          success: true,
          count: bootcamps.length,
          data: bootcamps,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc Get single bootcamp
  //@route GET /api/v1/bootcamps/:id
  //@access Public
  getBootcamp(req, res, next) {
    Bootcamp.findById(req.params.id)
      .then((bootcamp) => {
        if (!bootcamp) {
          throw new Error("cant find anything with this id");
        } else {
          res.status(200).json({
            success: true,
            data: bootcamp,
          });
        }
      })
      .catch((err) => {
        next(
          new ErrorResponse(
            `Bootcamp not found with id of ${req.params.id}`,
            404
          )
        );
      });
  }

  // @desc Create new bootcamp
  //@route POST /api/v1/bootcamps
  //@access Private

  async createBootcamp(req, res, next) {
    Bootcamp.create(req.body)
      .then((bootcamp) => {
        res.status(201).json({
          success: true,
          data: bootcamp,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: err,
        });
      });
  }

  // @desc Update bootcamp
  //@route PUT /api/v1/bootcamps/:id
  //@access Private
  updateBootcamp(req, res, next) {
    Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      // we want to get the updated data after the update
      new: true,
      // we want to run the validators as well
      runValidators: true,
    })
      .then((bootcamp) => {
        if (!bootcamp) {
          throw new Error("Can't find the specified bootcamp");
        }
        res.status(200).json({
          success: true,
          data: bootcamp,
        });
      })
      .catch((err) => {
        // Sending a 404 status code with the response
        res.status(404).json({
          success: false,
          error: err.message, // Include the error message in the response for debugging
        });
      });
  }

  // @desc Delete bootcamp
  //@route DELETE /api/v1/bootcamps/:id
  //@access Private
  deleteBootcamp(req, res, next) {
    Bootcamp.findByIdAndDelete(req.params.id)
      .then((bootcamp) => {
        if (!bootcamp) {
          throw new Error("can't find anything ");
        }
        res.status(200).json({
          success: true,
          data: {},
        });
      })
      .catch((err) => {
        res.status(404).json({
          success: false,
          data: {},
        });
      });
  }
}

module.exports = BootcampsRoutes;
