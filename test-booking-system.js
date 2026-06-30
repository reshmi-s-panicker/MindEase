// Test script to verify booking system
const sqlite3 = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'server', 'data', 'mind-ease.db');
const db = sqlite3(dbPath);

console.log('🔍 Testing Booking System...\n');

// Test 1: Check if database exists and has tables
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📋 Database Tables:', tables.map(t => t.name));
  
  // Test 2: Check users table
  const users = db.prepare('SELECT * FROM users').all();
  console.log('\n👥 Users in database:');
  users.forEach(user => {
    console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Type: ${user.user_type}, Institution: ${user.institution}`);
  });
  
  // Test 3: Check bookings table
  const bookings = db.prepare('SELECT * FROM bookings').all();
  console.log('\n📅 Bookings in database:');
  if (bookings.length === 0) {
    console.log('  No bookings found');
  } else {
    bookings.forEach(booking => {
      console.log(`  - Booking ID: ${booking.id}, Student: ${booking.student_id}, Counselor: ${booking.counselor_id}, Date: ${booking.preferred_date}, Status: ${booking.status}`);
    });
  }
  
  // Test 4: Test the getBookingsByCounselor query
  console.log('\n🔍 Testing counselor booking query...');
  const counselors = db.prepare('SELECT id, name FROM users WHERE user_type = ?').all('counselor');
  counselors.forEach(counselor => {
    const counselorBookings = db.prepare(`
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
    `).all(counselor.id);
    
    console.log(`\n  Counselor ${counselor.name} (ID: ${counselor.id}):`);
    if (counselorBookings.length === 0) {
      console.log('    No bookings found');
    } else {
      counselorBookings.forEach(booking => {
        console.log(`    - Booking ${booking.id}: ${booking.student_name} on ${booking.preferred_date} at ${booking.preferred_time}`);
      });
    }
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}

console.log('\n✅ Test completed!');
