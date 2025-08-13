const db = require('../db');

exports.applyLeave = (req, res) => {
  const { studentId } = req.params;
  const { leaveType, fromDate, toDate, reason } = req.body;

  // Step 1: Get the warden_id from the students table
  const getWardenSql = `SELECT warden_id FROM students WHERE student_id = ?`;

  db.query(getWardenSql, [studentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const wardenId = result[0].warden_id;

    // Step 2: Insert the leave request with the fetched warden_id
    const insertLeaveSql = `
      INSERT INTO leave_requests
      (student_id, warden_id, from_date, to_date, reason, leave_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertLeaveSql, [studentId, wardenId, fromDate, toDate, reason, leaveType], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(200).json({ message: "Leave applied successfully" });
    });
  });
};


// Get Leaves by Student To show in Student Page
exports.getLeavesByStudent = (req, res) => {
  const { studentId } = req.params;

  const sql = `SELECT * FROM leave_requests WHERE student_id = ? ORDER BY created_at DESC LIMIT 10`; //here you can change how many past leaves to show 

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Get All Leaves For (Warden View)
exports.getAllLeaves = (req, res) => {
  const sql = `SELECT * FROM leave_requests ORDER BY created_at DESC AND status = 'pending'`; // Fetch all pending leave requests

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Update Warden Approval (Change Status)
exports.updateWardenApproval = (req, res) => {
  const { leaveId } = req.params;
  const { status } = req.body; 

  const sql = `UPDATE leave_requests SET status = ? WHERE id = ?`;

  db.query(sql, [status, leaveId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Leave status updated" });
  });
};

// Delete Leave Request
exports.deleteLeave = (req, res) => {
  const { leaveId } = req.params;

  const sql = `DELETE FROM leave_requests WHERE id = ? AND status = 'pending'`;

  db.query(sql, [leaveId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Leave request deleted" });
  });
};
