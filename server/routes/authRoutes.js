const express = require("express");
const router = express.Router();
const { adminLogin, signup, login } = require("../controllers/authController");


router.post("/admin/login", adminLogin);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;