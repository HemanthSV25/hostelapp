const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password,role_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword,1]
    );

    const [roleData] = await pool.query('SELECT role_name FROM roles WHERE id = ?', [role_id]);

    const user = {
      id: result.insertId,
      email,
      role: roleData[0].role_name,
    };

    const token = generateToken(user);

    res.status(201).json({ message: 'Registered successfully', token, user });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      `SELECT users.*, roles.role_name FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE email = ?`, [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role_name,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const [users] = await pool.query(
      `SELECT users.*, roles.role_name FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User does not exist. Access denied.' });
    }

    const user = users[0];
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role_name,
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};











// const bcrypt = require('bcryptjs');
// const { pool } = require('../config/db');

// // Register new faculty user
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const [existingStudent] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
//      const [existingFaculty] = await pool.query('SELECT * FROM faculty WHERE email = ?', [email]);
//     if (existingStudent.length > 0) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }
//     if (existingFaculty.length > 0) {
//       return res.status(400).json({ message: 'Email already in use' });
//     } 
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const [result1] = await pool.query(
//       'INSERT INTO students (email, password) VALUES (?, ?)',
//       [email, hashedPassword]
//     );
//      const [result2] = await pool.query(
//       'INSERT INTO faculty (email, password) VALUES (?, ?)',
//       [email, hashedPassword]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Student registered successfully!',
//       userId: result1.insertId
//     });
//     res.status(201).json({
//       success: true,
//       message: 'Faculty registered successfully!',
//       userId: result2.insertId
//     });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Faculty login
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const [users] = await pool.query('SELECT * FROM faculty WHERE email = ?', [email]);

//     if (users.length === 0) {
//       return res.status(401).json({ message: 'User does not exist' });
//     }

//     const user = users[0];
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     res.status(200).json({
//       id: user.id,
//       email: user.email,
//       role:user.role
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Google login for students and faculty
// exports.googleLogin = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const [studentRows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
//     if (studentRows.length > 0) {
//       const student = studentRows[0];
//       return res.status(200).json({
//         id: student.id,
//         email: student.email,
//         name: student.name,
//         role: 'Student',
//       });
//     }

//     const [facultyRows] = await pool.query('SELECT * FROM faculty WHERE email = ?', [email]);
//     if (facultyRows.length > 0) {
//       const faculty = facultyRows[0];
//       return res.status(200).json({
//         id: faculty.id,
//         email: faculty.email,
//         name: faculty.name,
//         role: faculty.role,
//       });
//     }

//     return res.status(401).json({ message: 'User does not exist. Access denied.' });

//   } catch (err) {
//     console.error('Google login error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

