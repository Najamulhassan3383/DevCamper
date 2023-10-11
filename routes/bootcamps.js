const express = require("express");

const BootcampsRoutes = require("../controllers/bootcamps");
//include other resouce routers
const CourseRouter = require("./courses");
const router = express.Router();
const bootcampsRoutes = new BootcampsRoutes();

//re route it into other resource routers

router.use("/:bootcampId/courses", CourseRouter);

router
  .route("/radius/:zipcode/:distance")
  .get(bootcampsRoutes.getBootcampsInRadius);

router
  .route("/")
  .get(bootcampsRoutes.getBootcamps)
  .post(bootcampsRoutes.createBootcamp);

router
  .route("/:id")
  .get(bootcampsRoutes.getBootcamp)
  .put(bootcampsRoutes.updateBootcamp)
  .delete(bootcampsRoutes.deleteBootcamp);

module.exports = router;
