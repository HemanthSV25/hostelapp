const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const db = require('../db');

// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: '1d' }
//   );
// };

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

    // const token = generateToken(user);

    res.status(201).json({ message: 'Registered successfully', token, user });  //here token is not removed  when u enable jwt u have to enable again
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

    // const token = generateToken({
    //   id: user.id,
    //   email: user.email,
    //   role: user.role_name,
    // });

    res.status(200).json({
      message: 'Login successful',
      // token,
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
    // const token = generateToken({
    //   id: user.id,
    //   email: user.email,
    //   role: user.role_name,
    // });

    return res.status(200).json({
      // token,
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











