const db = require('../db');

exports.applyLeave = (req, res) => {
  const {
    email,
    leaveType,
    fromDate,
    toDate,
    fromTime,
    toTime,
    reason
  } = req.body;

  const sql = `
    INSERT INTO leaves
    (student_id, leave_type, from_date, to_date, from_time, to_time, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    email,
    leaveType,
    fromDate,
    toDate,
    fromTime,
    toTime,
    reason
  ], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Leave applied successfully" });
  });
};

exports.getLeavesByStudent = (req, res) => {
  const { studentId } = req.params;

  const sql = `SELECT * FROM leaves WHERE student_id = ? ORDER BY created_at DESC`;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};


exports.updateWardenApproval = (req, res) => {
  const { leaveId } = req.params;
  const { status } = req.body;

  const sql = `UPDATE leaves SET warden_approval = ? WHERE id = ?`;

  db.query(sql, [status, leaveId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Warden approval updated" });
  });
};






// // controllers/leaveController.js
// const leaveController = {
//   // Get all leave applications
//   getAllLeaves: (req, res) => {
//     const query = `
//       SELECT l.*, s.name as student_name, s.student_id
//       FROM leave_applications l
//       LEFT JOIN students s ON l.student_id = s.id
//       ORDER BY l.created_at DESC
//     `;
    
//     req.db.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching leave applications:', err);
//         return res.status(500).json({ error: 'Failed to fetch leave applications' });
//       }
//       res.json(results);
//     });
//   },

//   // Get leave by ID
//   getLeaveById: (req, res) => {
//     const leaveId = req.params.id;
//     const query = `
//       SELECT l.*, s.name as student_name, s.student_id
//       FROM leave_applications l
//       LEFT JOIN students s ON l.student_id = s.id
//       WHERE l.id = ?
//     `;
    
//     req.db.query(query, [leaveId], (err, results) => {
//       if (err) {
//         console.error('Error fetching leave application:', err);
//         return res.status(500).json({ error: 'Failed to fetch leave application' });
//       }
      
//       if (results.length === 0) {
//         return res.status(404).json({ error: 'Leave application not found' });
//       }
      
//       res.json(results[0]);
//     });
//   },

//   // Create new leave application
//   createLeave: (req, res) => {
//     const { student_id, leave_type, start_date, end_date, reason, emergency_contact } = req.body;
    
//     const query = `
//       INSERT INTO leave_applications (student_id, leave_type, start_date, end_date, reason, emergency_contact, status)
//       VALUES (?, ?, ?, ?, ?, ?, 'pending')
//     `;
    
//     req.db.query(query, [student_id, leave_type, start_date, end_date, reason, emergency_contact], (err, result) => {
//       if (err) {
//         console.error('Error creating leave application:', err);
//         return res.status(500).json({ error: 'Failed to create leave application' });
//       }
      
//       res.status(201).json({
//         message: 'Leave application created successfully',
//         leaveId: result.insertId
//       });
//     });
//   },

//   // Update leave status
//   updateLeaveStatus: (req, res) => {
//     const leaveId = req.params.id;
//     const { status, admin_remarks } = req.body;
    
//     const query = `
//       UPDATE leave_applications 
//       SET status = ?, admin_remarks = ?, updated_at = NOW()
//       WHERE id = ?
//     `;
    
//     req.db.query(query, [status, admin_remarks, leaveId], (err, result) => {
//       if (err) {
//         console.error('Error updating leave application:', err);
//         return res.status(500).json({ error: 'Failed to update leave application' });
//       }
      
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'Leave application not found' });
//       }
      
//       res.json({ message: 'Leave application updated successfully' });
//     });
//   },

//   // Get leaves by student ID
//   getLeavesByStudent: (req, res) => {
//     const studentId = req.params.studentId;
//     const query = `
//       SELECT * FROM leave_applications 
//       WHERE student_id = ? 
//       ORDER BY created_at DESC
//     `;
    
//     req.db.query(query, [studentId], (err, results) => {
//       if (err) {
//         console.error('Error fetching student leaves:', err);
//         return res.status(500).json({ error: 'Failed to fetch leave applications' });
//       }
      
//       res.json(results);
//     });
//   }
// };