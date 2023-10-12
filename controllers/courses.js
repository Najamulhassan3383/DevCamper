const errorHandler = require("../middleware/error");
const Courses = require("../models/Courses");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamps");

class CoursesRoutes {
  // @desc Get  courses
  //@route GET /api/v1/courses
  //@route GET /api/v1/bootcamps/:bootcampId/courses
  //@access Public

  getCourses(req, res, next) {
    let query;

    console.log(req.bootcampId);
    if (req.bootcampId) {
      query = Courses.find({ bootcamp: req.bootcampId });
    } else {
      query = Courses.find().populate({
        path: "bootcamp",
        select: "name description",
      });
    }

    query
      .then((courses) => {
        if (!courses) {
          throw new ErrorResponse(
            `Courses not found with this ${req.params.id}`,
            404
          );
        }

        res.status(200).json({
          success: true,

          count: courses.length,
          data: courses,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc Get  courses
  //@route GET /api/v1/courses/:id

  //@access Public

  getCourse(req, res, next) {
    let query;
    console.log(req.params);
    Courses.findById(req.params.id)
      .populate({
        path: "bootcamp",
        select: "name description",
      })
      .then((course) => {
        if (!course) {
          throw new ErrorResponse(
            `Courses not found with this ${req.params.id}`,
            404
          );
        }

        res.status(200).json({
          success: true,

          data: course,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc Get  courses
  //@route GET /api/v1/courses/:id

  //@access Public

  getCourse(req, res, next) {
    let query;
    console.log(req.params);
    Courses.findById(req.params.id)
      .populate({
        path: "bootcamp",
        select: "name description",
      })
      .then((course) => {
        if (!course) {
          throw new ErrorResponse(
            `Courses not found with this ${req.params.id}`,
            404
          );
        }

        res.status(200).json({
          success: true,

          data: course,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc Add  courses
  //@route POST /api/v1/bootcamps/:bootcampId/courses
  //@access Private
  addCourse(req, res, next) {
    console.log(req.body);
    Bootcamp.findById(req.bootcampId)
      .then((bootcamp) => {
        if (!bootcamp) {
          throw new ErrorResponse(
            `Bootcamp not found with this ${req.params.bootcampId}`,
            404
          );
        }

        Courses.create(req.body)
          .then((course) => {
            res.status(200).json({
              success: true,

              data: course,
            });
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc Update  courses
  //@route PUT /api/v1 / courses /: id
  // @access Private
  updateCouse(req, res, next) {
    Courses.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((course) => {
        if (!course) {
          throw new ErrorResponse(
            `Courses not found with this ${req.params.id}`,
            404
          );
        }

        res.status(200).json({
          success: true,

          data: course,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  // @desc delte  courses
  //@route DELETE /api/v1 / courses /: id
  // @access Private
  deleteCourse(req, res, next) {
    Courses.findById(req.params.id)
      .then(async (course) => {
        if (!course) {
          throw new ErrorResponse(
            `Courses not found with this ${req.params.id}`,
            404
          );
        }

        await course.deleteOne();

        res.status(200).json({
          success: true,

          data: {},
        });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = CoursesRoutes;
