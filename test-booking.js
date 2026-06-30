// Simple test script to verify booking system
const fetch = require('node-fetch');

async function testBookingSystem() {
  try {
    console.log('Testing booking system...');
    
    // Test 1: Check if backend is running
    const healthResponse = await fetch('http://localhost:4000/health');
    console.log('Backend health check:', healthResponse.status);
    
    // Test 2: Create a test booking
    const testBooking = {
      student_id: 1,
      counselor_id: 2,
      preferred_date: '2025-09-26',
      preferred_time: '10:00',
      session_type: 'individual',
      reason: 'Test booking',
      anxiety_level: 'mild',
      depression_level: 'none',
      academic_stress: 'moderate',
      burnout_level: 'sometimes',
      sleep_quality: 'good',
      social_isolation: 'rarely',
      additional_concerns: 'Test concerns'
    };
    
    const bookingResponse = await fetch('http://localhost:4000/api/auth/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBooking)
    });
    
    console.log('Booking creation response:', bookingResponse.status);
    const bookingResult = await bookingResponse.json();
    console.log('Booking result:', bookingResult);
    
    // Test 3: Fetch bookings for counselor
    const bookingsResponse = await fetch('http://localhost:4000/api/auth/bookings/counselor/2');
    console.log('Bookings fetch response:', bookingsResponse.status);
    const bookingsResult = await bookingsResponse.json();
    console.log('Bookings result:', bookingsResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testBookingSystem();

