const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;




const studentController = {
  // Get all students
  getAllStudents: (req, res) => {
    const query = `
      SELECT s.*, h.name as hostel_name, w.name as warden_name, w.phone as warden_phone
      FROM students s
      LEFT JOIN hostels h ON s.hostel_id = h.id
      LEFT JOIN wardens w ON h.warden_id = w.id
      ORDER BY s.created_at DESC
    `;
    
    req.db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching students:', err);
        return res.status(500).json({ error: 'Failed to fetch students' });
      }
      res.json(results);
    });
  },

  // Get student by ID
  getStudentById: (req, res) => {
    const studentId = req.params.id;
    const query = `
      SELECT 
        s.*,
        h.name as hostel,
        w.name as warden,
        w.phone as warden_phone,
        CONCAT(s.student_id) as studentId,
        s.profile_image as profileImage,
        s.group_number as group
      FROM students s
      LEFT JOIN hostels h ON s.hostel_id = h.id
      LEFT JOIN wardens w ON h.warden_id = w.id
      WHERE s.id = ?
    `;
    
    req.db.query(query, [studentId], (err, results) => {
      if (err) {
        console.error('Error fetching student:', err);
        return res.status(500).json({ error: 'Failed to fetch student' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      const student = results[0];
      // Format the response to match frontend expectations
      const formattedStudent = {
        id: student.id,
        name: student.name,
        course: student.course,
        hostel: student.hostel,
        warden: student.warden,
        room: student.room,
        studentId: student.student_id,
        profileImage: student.profile_image,
        group: student.group_number,
        phone: student.phone,
        email: student.email
      };
      
      res.json(formattedStudent);
    });
  },

  // Create new student
  createStudent: (req, res) => {
    const {
      name,
      student_id,
      course,
      hostel_id,
      room,
      phone,
      email,
      profile_image,
      group_number
    } = req.body;
    
    const query = `
      INSERT INTO students (name, student_id, course, hostel_id, room, phone, email, profile_image, group_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    req.db.query(query, [name, student_id, course, hostel_id, room, phone, email, profile_image, group_number], (err, result) => {
      if (err) {
        console.error('Error creating student:', err);
        return res.status(500).json({ error: 'Failed to create student' });
      }
      
      res.status(201).json({
        message: 'Student created successfully',
        studentId: result.insertId
      });
    });
  },

  // Update student
  updateStudent: (req, res) => {
    const studentId = req.params.id;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE students SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    values.push(studentId);
    
    req.db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating student:', err);
        return res.status(500).json({ error: 'Failed to update student' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      res.json({ message: 'Student updated successfully' });
    });
  },

  // Delete student
  deleteStudent: (req, res) => {
    const studentId = req.params.id;
    const query = 'DELETE FROM students WHERE id = ?';
    
    req.db.query(query, [studentId], (err, result) => {
      if (err) {
        console.error('Error deleting student:', err);
        return res.status(500).json({ error: 'Failed to delete student' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      res.json({ message: 'Student deleted successfully' });
    });
  },

  // Get student biometric data
  getStudentBiometric: (req, res) => {
    const studentId = req.params.id;
    const query = `
      SELECT 
        DATE(timestamp) as date,
        attendance_percentage,
        night_attendance,
        created_at
      FROM biometric_data 
      WHERE student_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 30
    `;
    
    req.db.query(query, [studentId], (err, results) => {
      if (err) {
        console.error('Error fetching biometric data:', err);
        return res.status(500).json({ error: 'Failed to fetch biometric data' });
      }
      
      res.json(results);
    });
  }
};

module.exports = studentController;






