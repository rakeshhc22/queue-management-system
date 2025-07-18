const express = require("express");
const router = express.Router();
const { loginManager, registerManager } = require("../controllers/authController");

router.post("/login", loginManager);
router.post("/register", registerManager);

module.exports = router;
