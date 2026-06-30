import React, { useEffect } from "react";
import LoadingPage from "./LoadingPage";
import AuthPage from "./AuthPage";
import StudentDashboard from "./StudentDashboard";
import CounselorDashboard from "./CounselorDashboard";
import PomodoroTimer from "./pomodoro";
import BreathingExercise from "./Breathe";
import BookingModal from "./BookingModal";
import RelaxationPage from "./music";
import MeditationVideosPage from "./videos";
import MoodTrackerPage from "./journal";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  
  useEffect(() => {
    // Only disable scroll on the landing page (/) and specific pages that need it
    const noScrollRoutes = ['/', '/pomodoro', '/breathe'];
    const shouldDisableScroll = noScrollRoutes.includes(location.pathname);
    
    document.body.style.overflow = shouldDisableScroll ? "hidden" : "auto";
    
    return () => {
      document.body.style.overflow = "auto"; // re-enable if unmounted
    };
  }, [location.pathname]);

  return (
    <Routes>
        <Route
          path="/"
          element={
            <>
              <LoadingPage />
              <AuthPage />
            </>
          }
        />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
        <Route path="/pomodoro" element={<PomodoroTimer />} /> {/* <-- added route */}
        <Route path="/breathe" element={<BreathingExercise />} /> {/* <-- added route */}
        <Route path="/book" element={<BookingModal />} /> {/* <-- added route */}
        <Route path="/music" element={<RelaxationPage />} /> {/* <-- added route */}
        <Route path="/videos" element={<MeditationVideosPage />} /> {/* <-- added route */}
        <Route path="/journal" element={<MoodTrackerPage />} /> {/* <-- added route */}
        {/* later add counselor + admin */}
    </Routes>
  );
}

export default App;
