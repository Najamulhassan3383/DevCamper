// Desc: Controller for bootcamps

const errorHandler = require("../middleware/error");
const Bootcamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const geoCoder = require("../utils/geoCoder");

class BootcampsRoutes {
  // @desc Get all bootcamps
  //@route GET /api/v1/bootcamps
  //@access Public
  getBootcamps(req, res, next) {
    let query;
    let queryStr = JSON.stringify(req.query);
    // console.log(queryStr);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => {
      return `$${match}`;
    });
    // console.log(queryStr);

    Bootcamp.find(JSON.parse(queryStr))
      .then((bootcamps) => {
        if (!bootcamps) {
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.id}`,
            404
          );
        } else {
          res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
          });
        }
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
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.id}`,
            404
          );
        } else {
          res.status(200).json({
            success: true,
            data: bootcamp,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc Create new bootcamp
  //@route POST /api/v1/bootcamps
  //@access Private

  async createBootcamp(req, res, next) {
    Bootcamp.create(req.body)
      .then((bootcamp) => {
        if (!bootcamp) {
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.id}`,
            404
          );
        } else {
          res.status(201).json({
            success: true,
            data: bootcamp,
          });
        }
      })
      .catch((err) => {
        next(err);
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
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.id}`,
            404
          );
        }
        res.status(200).json({
          success: true,
          data: bootcamp,
        });
      })
      .catch((err) => {
        // Sending a 404 status code with the response
        next(err);
      });
  }

  // @desc Delete bootcamp
  //@route DELETE /api/v1/bootcamps/:id
  //@access Private
  deleteBootcamp(req, res, next) {
    Bootcamp.findByIdAndDelete(req.params.id)
      .then((bootcamp) => {
        if (!bootcamp) {
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.id}`,
            404
          );
        }
        res.status(200).json({
          success: true,
          data: {},
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc get bootcamp within a radius
  //@route GET /api/v1/bootcamps/radius/:zipcode/:distance
  //@access Private
  getBootcampsInRadius(req, res, next) {
    const { zipcode, distance } = req.params;
    console.log(zipcode, distance);

    //get lat/lang from geocoder
    geoCoder
      .geocode(zipcode)
      .then((loc) => {
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        const radius = distance / 3963;

        Bootcamp.find({
          location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] },
          },
        }).then((bootcamps) => {
          res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
          });
        });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = BootcampsRoutes;
