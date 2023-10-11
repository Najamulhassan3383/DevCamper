const errorHandler = require("../middleware/error");
const Courses = require("../models/Courses");
const ErrorResponse = require("../utils/errorResponse");

class CoursesRoutes {
  // @desc Get  courses
  //@route GET /api/v1/courses
  //@route GET /api/v1/bootcamps/:bootcampId/courses
  //@access Public

  getCourses(req, res, next) {
    let query;
    console.log(req.params);
    if (req.params.bootcampId) {
      query = Courses.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Courses.find();
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
}

module.exports = CoursesRoutes;
