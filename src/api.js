const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_) {
    // Non-JSON response (e.g., CRA proxy error). Map to readable error.
    if (!res.ok) {
      const message = text?.slice(0, 200) || 'Request failed';
      const error = new Error(message);
      error.status = res.status;
      throw error;
    }
    // If ok but not JSON, just return the raw text
    return { raw: text };
  }
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export function registerUser(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCounselorsByInstitution(institution) {
  return request(`/api/auth/counselors/${encodeURIComponent(institution)}`);
}

export function createBooking(bookingData) {
  return request('/api/auth/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

export function getBookingsByCounselor(counselorId) {
  return request(`/api/auth/bookings/counselor/${counselorId}`);
}

export function getBookingsByCounselorName(counselorName) {
  return request(`/api/auth/bookings/counselor-name/${encodeURIComponent(counselorName)}`);
}

export function updateBookingStatus(bookingId, status) {
  return request(`/api/auth/bookings/${bookingId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}


