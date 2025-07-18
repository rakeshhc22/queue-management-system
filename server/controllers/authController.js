const Manager = require("../models/Manager");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
exports.registerManager = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new manager
    const newManager = new Manager({
      name,
      email,
      password: hashedPassword,
    });

    await newManager.save();

    res.status(201).json({ message: "Manager registered successfully" });
  } catch (err) {
    console.error("❌ Error in registerManager:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /api/auth/login
exports.loginManager = async (req, res) => {
  const { email, password } = req.body;

  try {
    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: manager._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("❌ Error in loginManager:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
