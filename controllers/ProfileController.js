const { pool } = require('../config/db');

exports.getProfile = async (req, res) => {
  const { id, email, role } = req.user;

  if (!id || !email || !role) {
    return res.status(400).json({ message: 'Invalid user data in token' });
  }

  try {
    let result;

   if (role.toLowerCase() === 'student') {
            [result] = await pool.query(
          `SELECT 
           s.id, s.name, s.email, s.student_id, s.contact, s.department, s.year,
           s.grouptype, s.hostel, s.room, s.warden_id,
           w.name AS warden_name, w.contact AS warden_contact
          FROM students s
           LEFT JOIN warden w ON s.warden_id = w.warden_id
          WHERE s.email = ?`,
          [email]
        );
   }
 else if (role.toLowerCase() === 'warden') {
      [result] = await pool.query(
        `SELECT id, name, email, warden_id, contact, department, hostel, floor 
         FROM warden WHERE email = ?`,
        [email]
      );
    } else if (
      ['hostelmanager', 'messmanager', 'caretaker'].includes(role.toLowerCase())
    ) {
      [result] = await pool.query(
        `SELECT id, user_id, name, email, contact 
         FROM hostelstaff WHERE email = ?`,
        [email]
      );
    } else {
      return res.status(403).json({ message: 'Role not recognized' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.json(result[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// const { pool } = require('../config/db'); 


// exports.getProfile = async (req, res) => {
//   const { email} = req.params;

//   if (!email) return res.status(400).json({ message: 'email is required' });

//   try {
//     const [userProfile] = await pool.query(
//       'SELECT id, name, department,grouptype, contact FROM users WHERE email = ?',
//       [email]
//     );

//     if (userProfile.length === 0)
//       return res.status(404).json({ message: 'User not found' });

//     return res.json(userProfile[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


// // const pool = require('../config/db');

// // exports.getProfile = async (req, res) => {
// //   const { id, role } = req.user;

// //   try {
// //     // if (role === 'Student') {
// //       const [students] = await pool.query(
// //         'SELECT id, name, department, `group`, rollno, contactno FROM students WHERE id = ?',
// //         [id]
// //       );
// //       if (students.length === 0) return res.status(404).json({ message: 'Student not found' });
// //       return res.json(students[0]);
// //     // }

// //     // Warden
// //     if (role === 'Warden') {
// //       const [faculty] = await pool.query(
// //         'SELECT id AS facultyid, name, department, email, designation, contactno FROM faculty WHERE id = ?',
// //         [id]
// //       );
// //       if (faculty.length === 0) return res.status(404).json({ message: 'Warden not found' });
// //       return res.json(faculty[0]);
// //     }

// //     // Hostel Manager
// //     if (role === 'Hostelmanager') {
// //       const [manager] = await pool.query(
// //         'SELECT id, name, email, designation, contactno FROM faculty WHERE id = ?',
// //         [id]
// //       );
// //       if (manager.length === 0) return res.status(404).json({ message: 'Hostel Manager not found' });
// //       return res.json(manager[0]);
// //     }

// //     // Mess Manager
// //     if (role === 'Messmanager') {
// //       const [messManager] = await pool.query(
// //         'SELECT id, name, email, designation, contactno FROM faculty WHERE id = ?',
// //         [id]
// //       );
// //       if (messManager.length === 0) return res.status(404).json({ message: 'Mess Manager not found' });
// //       return res.json(messManager[0]);
// //     }

// //     // Caretaker
// //     if (role === 'Caretaker') {
// //       const [caretaker] = await pool.query(
// //         'SELECT id, name, email, designation, contactno FROM faculty WHERE id = ?',
// //         [id]
// //       );
// //       if (caretaker.length === 0) return res.status(404).json({ message: 'Caretaker not found' });
// //       return res.json(caretaker[0]);
// //     }

// //     return res.status(403).json({ message: 'Invalid role' });
// //   } catch (error) {
// //     console.error(error);
// //     return res.status(500).json({ message: 'Server error' });
// //   }
// // };
