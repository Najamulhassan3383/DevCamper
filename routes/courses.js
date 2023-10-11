const express = require("express");
const router = express.Router();
const CoursesRoutes = require("../controllers/courses");
// const CoursesRoutes = require("../controllers/courses");

const coursesRoutes = new CoursesRoutes();

router.route("/").get(coursesRoutes.getCourses);

module.exports = router;
