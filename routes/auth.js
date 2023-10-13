const express = require("express");
const router = express.Router();
const AuthRoutes = require("../controllers/auth");

const authRoutes = new AuthRoutes();

router.post("/register", authRoutes.register);

module.exports = router;
