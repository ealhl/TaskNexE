const db = require("./../datasbase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get all users
const getAllUsers = () => {
  return db
    .query("SELECT * FROM users;")
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

// Get user by id
const getUserById = (id) => {
  return db
    .query("SELECT * FROM users WHERE userid = $1;", [id])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

// Helper function to check if email exists
const userExists = async (email) => {
  return db
    .query("SELECT * FROM users WHERE email = $1;", [email])
    .then((data) => {
      return data.rows.length > 0;
    })
    .catch((err) => {
     throw new Error(err.message);
    });
};

// Add New User
// Function to create a new user
const createUser = async (user) => {
  try {
    // Check if user already exists
    const emailExists = await userExists(user.email);
    if (emailExists) {
      throw new Error("Email already registered");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // Insert new user into database
    const query = `
    INSERT INTO users (fname, lname, email, password, phone, department, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING userid, fname, lname, email, phone, department, role;
  `;

    const values = [
      user.fname,
      user.lname,
      user.email,
      hashedPassword,
      user.phone,
      user.department,
      user.role,
    ];

    const result = await db.query(query, values);
    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.userid,
        email: newUser.email,
        role: newUser.role,
        fname: newUser.fname,
        department: newUser.department,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user: newUser };
  } catch (error) {
    throw error;
  }
};

//update user
const updateUser = (id, user) => {
  return db
    .query(
      "UPDATE users SET fname = $1, lname = $2, email = $3, password = $4, phone = $5, department = $6, role = $7 WHERE userid = $8 RETURNING userid;",
      [
        user.fname,
        user.lname,
        user.email,
        user.password,
        user.phone,
        user.department,
        user.role,
        id,
      ]
    )
    .then((data) => {
      return data.rows[0].userid;
    })
    .catch((err) => {
     throw new Error(err.message);
    });
};

//delete user
const deleteUser = (id) => {
  db.query("DELETE FROM users WHERE userid = $1", [id])
    .then((data) => {
      return data.rows[0].userid;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

// Function to login user
const loginUser = async (email, password) => {
  try {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await db.query(query, [email]);
    
    const user = result.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { 
        userId: user.userid,
        email: user.email,
        role: user.role,
        fname: user.fname,
        department: user.department 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return { 
      token, 
      user: { 
        userid: user.userid,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role
      }
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
