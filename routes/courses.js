const express = require("express");
const router = express.Router();
const CoursesRoutes = require("../controllers/courses");
// const CoursesRoutes = require("../controllers/courses");

const coursesRoutes = new CoursesRoutes();

// router.get("/:bootcampId", coursesRoutes.getCourses);
router.route("/").get(coursesRoutes.getCourses).post(coursesRoutes.addCourse);
router
  .route("/:id")
  .put(coursesRoutes.updateCouse)
  .get(coursesRoutes.getCourse)
  .delete(coursesRoutes.deleteCourse);

module.exports = router;
