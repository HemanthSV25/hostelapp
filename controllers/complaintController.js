const complaintController = {
  // Get all complaints
  getAllComplaints: (req, res) => {
    const query = `
      SELECT c.*, s.name as student_name, s.student_id
      FROM complaints c
      LEFT JOIN students s ON c.student_id = s.id
      ORDER BY c.created_at DESC
    `;
    
    req.db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching complaints:', err);
        return res.status(500).json({ error: 'Failed to fetch complaints' });
      }
      res.json(results);
    });
  },

  // Get complaint by ID
  getComplaintById: (req, res) => {
    const complaintId = req.params.id;
    const query = `
      SELECT c.*, s.name as student_name, s.student_id
      FROM complaints c
      LEFT JOIN students s ON c.student_id = s.id
      WHERE c.id = ?
    `;
    
    req.db.query(query, [complaintId], (err, results) => {
      if (err) {
        console.error('Error fetching complaint:', err);
        return res.status(500).json({ error: 'Failed to fetch complaint' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      
      res.json(results[0]);
    });
  },

  // Create new complaint
  createComplaint: (req, res) => {
    const { student_id, category, title, description, priority } = req.body;
    
    const query = `
      INSERT INTO complaints (student_id, category, title, description, priority, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    
    req.db.query(query, [student_id, category, title, description, priority || 'medium'], (err, result) => {
      if (err) {
        console.error('Error creating complaint:', err);
        return res.status(500).json({ error: 'Failed to create complaint' });
      }
      
      res.status(201).json({
        message: 'Complaint created successfully',
        complaintId: result.insertId
      });
    });
  },

  // Update complaint status
  updateComplaintStatus: (req, res) => {
    const complaintId = req.params.id;
    const { status, admin_response } = req.body;
    
    const query = `
      UPDATE complaints 
      SET status = ?, admin_response = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    req.db.query(query, [status, admin_response, complaintId], (err, result) => {
      if (err) {
        console.error('Error updating complaint:', err);
        return res.status(500).json({ error: 'Failed to update complaint' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Complaint not found' });
      }
      
      res.json({ message: 'Complaint updated successfully' });
    });
  },

  // Get complaints by student ID
  getComplaintsByStudent: (req, res) => {
    const studentId = req.params.studentId;
    const query = `
      SELECT * FROM complaints 
      WHERE student_id = ? 
      ORDER BY created_at DESC
    `;
    
    req.db.query(query, [studentId], (err, results) => {
      if (err) {
        console.error('Error fetching student complaints:', err);
        return res.status(500).json({ error: 'Failed to fetch complaints' });
      }
      
      res.json(results);
    });
  }
};

