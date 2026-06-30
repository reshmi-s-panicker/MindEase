const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getCounselorsByInstitution, createBooking, getBookingsByCounselor, getBookingsByCounselorName, updateBookingStatus, getUserById } = require('../db');

const router = express.Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign(
    { id: user.id, email: user.email, userType: user.user_type },
    secret,
    { expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, userType, emergencyContact, institution } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existing = getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const id = createUser({ email, passwordHash, name, userType, emergencyContact, institution });
    const user = { id, email, name, user_type: userType || 'student', emergency_contact: emergencyContact || null, institution: institution || null };
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (userType && user.user_type !== userType) {
      return res.status(403).json({ error: 'User type mismatch' });
    }
    const token = signToken(user);
    res.json({
      user: { id: user.id, email: user.email, name: user.name, user_type: user.user_type },
      token,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/counselors/:institution', (req, res) => {
  try {
    const { institution } = req.params;
    const counselors = getCounselorsByInstitution(institution);
    res.json({ counselors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Booking endpoints
router.post('/bookings', async (req, res) => {
  try {
    const {
      student_id,
      counselor_id,
      preferred_date,
      preferred_time,
      session_type,
      reason,
      urgency_level,
      anxiety_level,
      depression_level,
      academic_stress,
      burnout_level,
      sleep_quality,
      social_isolation,
      additional_concerns
    } = req.body;

    console.log('Creating booking with data:', req.body);

    if (!student_id || !counselor_id || !preferred_date || !preferred_time || !session_type || !reason) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const bookingId = createBooking({
      student_id,
      counselor_id,
      preferred_date,
      preferred_time,
      session_type,
      reason,
      urgency_level,
      anxiety_level,
      depression_level,
      academic_stress,
      burnout_level,
      sleep_quality,
      social_isolation,
      additional_concerns,
      status: 'pending'
    });

    console.log('Created booking with ID:', bookingId);

    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking_id: bookingId 
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/bookings/counselor/:counselorId', (req, res) => {
  try {
    const { counselorId } = req.params;
    console.log('Fetching bookings for counselor ID:', counselorId);
    const bookings = getBookingsByCounselor(counselorId);
    console.log('Found bookings:', bookings);
    res.json({ bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/bookings/counselor-name/:counselorName', (req, res) => {
  try {
    const { counselorName } = req.params;
    console.log('Fetching bookings for counselor name:', counselorName);
    const bookings = getBookingsByCounselorName(counselorName);
    console.log('Found bookings by name:', bookings);
    res.json({ bookings });
  } catch (err) {
    console.error('Error fetching bookings by name:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/bookings/:bookingId/status', (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    updateBookingStatus(bookingId, status);
    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


