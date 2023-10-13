const express = require("express");
const BootcampsRoutes = require("../controllers/bootcamps");
const CourseRouter = require("./courses");
const router = express.Router();
const bootcampsRoutes = new BootcampsRoutes();
const advancedResults = require("../middleware/advanceResults");
const Bootcamp = require("../models/Bootcamps");

// Reroute requests starting with /:bootcampId/courses to the CourseRouter
router.param("bootcampId", (req, res, next, bootcampId) => {
  // You can perform validation or fetch the bootcamp from the database here
  // For simplicity, let's assume bootcampId is a valid ID
  req.bootcampId = bootcampId;
  console.log("Bootcamp ID is: " + req.bootcampId);
  console.log(req.body);
  next();
});
router.use("/:bootcampId/courses", CourseRouter);

router
  .route("/radius/:zipcode/:distance")
  .get(bootcampsRoutes.getBootcampsInRadius);

router.route("/:id/photo").put(bootcampsRoutes.bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), bootcampsRoutes.getBootcamps)
  .post(bootcampsRoutes.createBootcamp);

router
  .route("/:id")
  .get(bootcampsRoutes.getBootcamp)
  .put(bootcampsRoutes.updateBootcamp)
  .delete(bootcampsRoutes.deleteBootcamp);

module.exports = router;
