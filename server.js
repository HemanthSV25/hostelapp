const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const wardenLeaveRoutes = require('./routes/wardenLeaveRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/warden-leave', wardenLeaveRoutes);
// const studentRoutes = require('./routes/studentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const leaveRoutes = require('./routes/leaveRoutes');

// app.use('/api/students', studentRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/leaves', leaveRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
