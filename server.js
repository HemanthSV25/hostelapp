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
const leaveRoutes = require('./routes/leaveRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/warden-leave', wardenLeaveRoutes);
app.use('/api/leave', leaveRoutes);

// app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
