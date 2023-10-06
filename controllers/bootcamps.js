// Desc: Controller for bootcamps

class BootcampsRoutes {
  // @desc Get all bootcamps
  //@route GET /api/v1/bootcamps
  //@access Public
  getBootcamps(req, res, next) {
    res.status(200).json({ success: true, msg: "show all bootcamps" });
  }

  // @desc Get single bootcamp
  //@route GET /api/v1/bootcamps/:id
  //@access Public
  getBootcamp(req, res, next) {
    res
      .status(200)
      .json({ success: true, msg: `get bootcamp ${req.params.id}` });
  }

  // @desc Create new bootcamp
  //@route POST /api/v1/bootcamps
  //@access Private

  createBootcamp(req, res, next) {
    res.status(200).json({ success: true, msg: "create new bootcamp" });
  }

  // @desc Update bootcamp
  //@route PUT /api/v1/bootcamps/:id
  //@access Private
  updateBootcamp(req, res, next) {
    res
      .status(200)
      .json({ success: true, msg: `update bootcamp ${req.params.id}` });
  }

  // @desc Delete bootcamp
  //@route DELETE /api/v1/bootcamps/:id
  //@access Private
  deleteBootcamp(req, res, next) {
    res
      .status(200)
      .json({ success: true, msg: `delete bootcamp ${req.params.id}` });
  }
}

module.exports = BootcampsRoutes;
