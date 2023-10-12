const express = require("express");
const router = express.Router();
const CoursesRoutes = require("../controllers/courses");
// const CoursesRoutes = require("../controllers/courses");

const coursesRoutes = new CoursesRoutes();

// router.get("/:bootcampId", coursesRoutes.getCourses);
router.route("/:id").put(coursesRoutes.updateCouse);
router.route("/").get(coursesRoutes.getCourses).post(coursesRoutes.addCourse);

module.exports = router;
