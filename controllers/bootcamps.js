// Desc: Controller for bootcamps

const errorHandler = require("../middleware/error");
const Bootcamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const geoCoder = require("../utils/geoCoder");
const Course = require("../models/Courses");
const path = require("path");

class BootcampsRoutes {
  // @desc Get all bootcamps
  //@route GET /api/v1/bootcamps
  //@access Public
  getBootcamps(req, res, next) {
    let query;
    let reqQuery = { ...req.query };

    // Remove fields that should not be part of the query
    const removeFields = ["select", "sort"];
    removeFields.forEach((item) => delete reqQuery[item]);

    let queryStr = JSON.stringify(reqQuery);
    query = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => {
      return `$${match}`;
    });

    let mongooseQuery = Bootcamp.find(JSON.parse(query)).populate("courses");

    // Apply select fields if specified in req.query.select
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      mongooseQuery = mongooseQuery.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      mongooseQuery = mongooseQuery.sort("-createdAt");
    }

    //pagination
    console.log("query is ", req.query);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    //for skipping certain amount of bootcamps
    // console.log(limit);

    mongooseQuery = mongooseQuery.skip(skip).limit(limit).exec();

    mongooseQuery
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
    Bootcamp.findById(req.params.id)
      .then(async (bootcamp) => {
        if (!bootcamp) {
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.id}`,
            404
          );
        }

        console.log("Bootcamp found, deleting associated courses...");

        // Delete associated courses (using deleteMany)
        await Course.deleteMany({ bootcamp: req.params.id });

        // Now, delete the bootcamp
        await bootcamp.deleteOne();

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
  // @desc upload photo of  bootcamp
  //@route PUT /api/v1/bootcamps/:id/photo
  //@access Private
  bootcampPhotoUpload(req, res, next) {
    Bootcamp.findById(req.params.id)
      .then(async (bootcamp) => {
        if (!bootcamp) {
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.id}`,
            404
          );
        }

        if (!req.files) {
          return next(new ErrorResponse("plz add a file", 400));
        }
        const file = req.files.file;
        console.log(file);
        if (!file.mimetype.startsWith("image")) {
          return next(new ErrorResponse("plz upload an image file", 400));
        }
        //CHECK FILE SIZE
        if (file.size > process.env.MAX_FILE_UPLOAD) {
          throw new ErrorResponse("plz add smaller size picture", 400);
        }

        //create custom file name
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
        // console.log(file.name);

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
          if (err) {
            console.log(err);
            return next(new ErrorResponse("Problem with file upload", 500));
          }
          Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
            .then((bootcamp) => {
              res.status(200).json({
                success: true,
                data: file.name,
              });
            })
            .catch((err) => {
              next(err);
            });
        });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = BootcampsRoutes;
