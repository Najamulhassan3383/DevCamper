const express = require("express");
const router = express.Router();
const BootcampsRoutes = require("../controllers/bootcamps");

const bootcampsRoutes = new BootcampsRoutes();

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
