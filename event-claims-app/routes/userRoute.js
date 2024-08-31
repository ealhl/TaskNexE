// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../db/models/user");

//GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { fname, lname, email, password, phone, department, role } = req.body;

    const newUser = {
      fname,
      lname,
      email,
      password,
      phone,
      department,
      role,
    };

    const { token, user } = await User.createUser(newUser);

    res.status(201).json({ token, user, message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.message === "Email already registered") {
      res.status(400).json({ message: "Email already registered" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});


// Delete User Route
router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUserId = await User.deleteUser(userId);
    res.status(200).json({ userId: deletedUserId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await User.loginUser(email, password);
    
    if (!result) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Invalid password') {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      res.status(500).json({ message: 'Server error during login' });
    }
  }
});

// Update User Route
// router.post("/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const userData = req.body;
//     const updatedUserId = await User.updateUser(userId, userData);
//     res.status(200).json({ userId: updatedUserId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

module.exports = router;
