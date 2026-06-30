const path = require('path');
const Database = require('better-sqlite3');

const dbDirectory = path.join(__dirname, '..', 'data');
const dbFile = path.join(dbDirectory, 'mind-ease.db');

// Ensure data directory exists
const fs = require('fs');
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const db = new Database(dbFile);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    user_type TEXT CHECK(user_type IN ('student','counselor','admin')) NOT NULL DEFAULT 'student',
    emergency_contact TEXT,
    institution TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    counselor_id INTEGER NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    session_type TEXT NOT NULL,
    reason TEXT NOT NULL,
    urgency_level TEXT,
    anxiety_level TEXT,
    depression_level TEXT,
    academic_stress TEXT,
    burnout_level TEXT,
    sleep_quality TEXT,
    social_isolation TEXT,
    additional_concerns TEXT,
    status TEXT CHECK(status IN ('pending','confirmed','completed','cancelled')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users (id),
    FOREIGN KEY (counselor_id) REFERENCES users (id)
  );
`);

// Ensure student-specific columns exist for older DBs
try {
  const columns = db.prepare("PRAGMA table_info(users)").all();
  const hasEmergency = columns.some((c) => c.name === 'emergency_contact');
  const hasInstitution = columns.some((c) => c.name === 'institution');
  if (!hasEmergency) {
    db.exec("ALTER TABLE users ADD COLUMN emergency_contact TEXT");
  }
  if (!hasInstitution) {
    db.exec("ALTER TABLE users ADD COLUMN institution TEXT");
  }
} catch (e) {
  // ignore if pragma/alter not supported in environment
}

function createUser({ email, passwordHash, name, userType, emergencyContact, institution }) {
  const stmt = db.prepare(
    'INSERT INTO users (email, password_hash, name, user_type, emergency_contact, institution) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const info = stmt.run(
    email,
    passwordHash,
    name || null,
    userType || 'student',
    emergencyContact || null,
    institution || null
  );
  return info.lastInsertRowid;
}

function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function getCounselorsByInstitution(institution) {
  return db.prepare('SELECT id, name, email FROM users WHERE user_type = ? AND institution = ?').all('counselor', institution);
}

function createBooking(bookingData) {
  console.log('Creating booking in database:', bookingData);
  const stmt = db.prepare(`
    INSERT INTO bookings (
      student_id, counselor_id, preferred_date, preferred_time, session_type,
      reason, urgency_level, anxiety_level, depression_level, academic_stress,
      burnout_level, sleep_quality, social_isolation, additional_concerns, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    bookingData.student_id,
    bookingData.counselor_id,
    bookingData.preferred_date,
    bookingData.preferred_time,
    bookingData.session_type,
    bookingData.reason,
    bookingData.urgency_level || null,
    bookingData.anxiety_level || null,
    bookingData.depression_level || null,
    bookingData.academic_stress || null,
    bookingData.burnout_level || null,
    bookingData.sleep_quality || null,
    bookingData.social_isolation || null,
    bookingData.additional_concerns || null,
    bookingData.status || 'pending'
  );
  
  console.log('Booking created with ID:', info.lastInsertRowid);
  return info.lastInsertRowid;
}

function getBookingsByCounselor(counselorId) {
  console.log('Database query for counselor ID:', counselorId);
  const result = db.prepare(`
    SELECT 
      b.*,
      s.name as student_name,
      s.email as student_email,
      c.name as counselor_name
    FROM bookings b
    JOIN users s ON b.student_id = s.id
    JOIN users c ON b.counselor_id = c.id
    WHERE b.counselor_id = ?
    ORDER BY b.preferred_date DESC, b.preferred_time DESC
  `).all(counselorId);
  console.log('Database query result:', result);
  return result;
}

function getBookingsByCounselorName(counselorName) {
  console.log('Database query for counselor name:', counselorName);
  const result = db.prepare(`
    SELECT 
      b.*,
      s.name as student_name,
      s.email as student_email,
      c.name as counselor_name
    FROM bookings b
    JOIN users s ON b.student_id = s.id
    JOIN users c ON b.counselor_id = c.id
    WHERE c.name = ?
    ORDER BY b.preferred_date DESC, b.preferred_time DESC
  `).all(counselorName);
  console.log('Database query result by name:', result);
  return result;
}

function updateBookingStatus(bookingId, status) {
  const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
  return stmt.run(status, bookingId);
}

function getUserById(userId) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

module.exports = {
  db,
  createUser,
  getUserByEmail,
  getCounselorsByInstitution,
  createBooking,
  getBookingsByCounselor,
  getBookingsByCounselorName,
  updateBookingStatus,
  getUserById,
};

// Optional seed helpers
async function ensureAdminSeed() {
  const existing = getUserByEmail('admin@local');
  if (existing) return;
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('admin123', 10);
  createUser({ email: 'admin@local', passwordHash, name: 'Administrator', userType: 'admin' });
}

module.exports.ensureAdminSeed = ensureAdminSeed;


