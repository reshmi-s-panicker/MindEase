import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Home, Calendar, TrendingUp, BookOpen, Edit3, Save, X, ChevronLeft, ChevronRight } from "lucide-react";

const MoodTrackerPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [moodEntries, setMoodEntries] = useState({});
  const [showJournal, setShowJournal] = useState(false);
  const [viewMode, setViewMode] = useState("today"); // today, week, month, stats
  const [motivationalQuote, setMotivationalQuote] = useState("");

  // Mood options with values for calculations
  const moodOptions = [
    { emoji: "😊", label: "Amazing", value: 5, color: "#48BB78" },
    { emoji: "🙂", label: "Good", value: 4, color: "#68D391" },
    { emoji: "😐", label: "Okay", value: 3, color: "#FBD38D" },
    { emoji: "😟", label: "Not Great", value: 2, color: "#F6AD55" },
    { emoji: "😢", label: "Awful", value: 1, color: "#FC8181" }
  ];

  // Motivational quotes based on mood
  const quotes = {
    5: [
      "Your positive energy is contagious! Keep shining bright! ✨",
      "Amazing days like this remind us how beautiful life can be! 🌟",
      "You're radiating joy today - embrace this wonderful feeling! 🌈"
    ],
    4: [
      "Good vibes attract good things. You're on the right track! 🌱",
      "Your optimism is your superpower. Keep it up! 💚",
      "Today's goodness is tomorrow's foundation. Well done! 🌿"
    ],
    3: [
      "Okay days are part of the journey. Tomorrow brings new possibilities! 🌸",
      "Even neutral days have their own quiet beauty. Be gentle with yourself. 🕊️",
      "Balance is key - you're doing just fine. Keep going! ⚖️"
    ],
    2: [
      "Tough days don't last, but resilient people like you do. 💪",
      "It's okay to not be okay sometimes. You're braver than you know. 🦋",
      "This feeling is temporary. Brighter days are ahead! 🌅"
    ],
    1: [
      "You're not alone in this. Take it one moment at a time. 🤗",
      "Be extra kind to yourself today. You deserve compassion. 💙",
      "Every storm runs out of rain. This too shall pass. 🌦️"
    ]
  };

  // Load mood entries from memory on component mount
  useEffect(() => {
    // In a real app, you'd load from localStorage here
    // For demo purposes, we'll start with empty state
    setMoodEntries({});
  }, []);

  // Save mood entries to memory
  const saveMoodEntries = (entries) => {
    setMoodEntries(entries);
    // In a real app: localStorage.setItem('moodEntries', JSON.stringify(entries));
  };

  // Get date string for storage key
  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    const dateKey = getDateKey(currentDate);
    const newEntries = {
      ...moodEntries,
      [dateKey]: {
        ...moodEntries[dateKey],
        mood: mood,
        date: dateKey,
        timestamp: new Date().toISOString()
      }
    };
    saveMoodEntries(newEntries);
    setSelectedMood(mood);
    
    // Set motivational quote
    const randomQuote = quotes[mood.value][Math.floor(Math.random() * quotes[mood.value].length)];
    setMotivationalQuote(randomQuote);
  };

  // Handle journal entry save
  const handleJournalSave = () => {
    const dateKey = getDateKey(currentDate);
    const newEntries = {
      ...moodEntries,
      [dateKey]: {
        ...moodEntries[dateKey],
        journal: journalEntry,
        date: dateKey,
        timestamp: new Date().toISOString()
      }
    };
    saveMoodEntries(newEntries);
    setShowJournal(false);
  };

  // Get current day's entry
  const getCurrentEntry = () => {
    const dateKey = getDateKey(currentDate);
    return moodEntries[dateKey] || {};
  };

  // Generate chart data for trends
  const getChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateKey(date);
      const entry = moodEntries[dateKey];
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry?.mood?.value || 0,
        label: entry?.mood?.label || 'No entry'
      });
    }
    return last7Days;
  };

  // Calculate mood statistics
  const getMoodStats = () => {
    const entries = Object.values(moodEntries).filter(entry => entry.mood);
    if (entries.length === 0) return null;

    const moodCounts = {};
    let totalMood = 0;

    entries.forEach(entry => {
      const moodLabel = entry.mood.label;
      moodCounts[moodLabel] = (moodCounts[moodLabel] || 0) + 1;
      totalMood += entry.mood.value;
    });

    const averageMood = totalMood / entries.length;
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    return {
      totalEntries: entries.length,
      averageMood: averageMood.toFixed(1),
      mostCommonMood,
      moodDistribution: Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / entries.length) * 100)
      }))
    };
  };

  // Navigate dates
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
    setSelectedMood(null);
    setJournalEntry("");
    setMotivationalQuote("");
  };

  // Load current entry when date changes
  useEffect(() => {
    const currentEntry = getCurrentEntry();
    setSelectedMood(currentEntry.mood || null);
    setJournalEntry(currentEntry.journal || "");
    
    if (currentEntry.mood) {
      const randomQuote = quotes[currentEntry.mood.value][Math.floor(Math.random() * quotes[currentEntry.mood.value].length)];
      setMotivationalQuote(randomQuote);
    }
  }, [currentDate, moodEntries]);

  const currentEntry = getCurrentEntry();
  const chartData = getChartData();
  const stats = getMoodStats();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
      padding: '1rem'
    }}>
      {/* Header */}
      <motion.div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.1)'
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            fontFamily: '"Playwrite DE SAS", cursive',
            margin: 0
          }}>
            Mind Ease
          </h1>
          <p style={{
            color: '#6b7280',
            marginTop: '0.25rem',
            fontFamily: '"Gowun Dodum", cursive',
            margin: 0
          }}>
            Mood Tracker & Journal
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['today', 'week', 'stats'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                border: 'none',
                background: viewMode === mode ? '#597c49ff' : 'rgba(255, 255, 255, 0.6)',
                color: viewMode === mode ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: '"Gowun Dodum", cursive',
                textTransform: 'capitalize'
              }}
            >
              {mode === 'today' && <Calendar size={16} style={{ marginRight: '0.5rem' }} />}
              {mode === 'week' && <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />}
              {mode === 'stats' && <BarChart size={16} style={{ marginRight: '0.5rem' }} />}
              {mode}
            </button>
          ))}
          
          <button 
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#597c49ff',
              color: 'white',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: '"Gowun Dodum", cursive'
            }}
          >
            <Home size={18} />
            Home
          </button>
        </div>
      </motion.div>

      {/* Today View */}
      {viewMode === 'today' && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Date Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2rem',
            gap: '1rem'
          }}>
            <button 
              onClick={() => navigateDate(-1)}
              style={{
                padding: '0.75rem',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronLeft size={20} color="#597c49ff" />
            </button>
            
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              fontFamily: '"Gowun Dodum", cursive',
              margin: 0,
              minWidth: '200px',
              textAlign: 'center'
            }}>
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            
            <button 
              onClick={() => navigateDate(1)}
              style={{
                padding: '0.75rem',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronRight size={20} color="#597c49ff" />
            </button>
          </div>

          {/* Mood Selection */}
          <motion.div
            style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: '#1f2937',
              fontFamily: '"Gowun Dodum", cursive'
            }}>
              How are you feeling today?
            </h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}>
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: selectedMood?.value === mood.value ? `3px solid ${mood.color}` : '2px solid transparent',
                    background: selectedMood?.value === mood.value ? `${mood.color}20` : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '80px'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {mood.emoji}
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontFamily: '"Gowun Dodum", cursive',
                    color: '#4b5563'
                  }}>
                    {mood.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Journal Button */}
            <button
              onClick={() => setShowJournal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#597c49ff',
                color: 'white',
                borderRadius: '1rem',
                border: 'none',
                cursor: 'pointer',
                margin: '0 auto',
                fontFamily: '"Gowun Dodum", cursive'
              }}
            >
              <BookOpen size={18} />
              {currentEntry.journal ? 'Edit Journal Entry' : 'Add Journal Entry'}
            </button>
          </motion.div>

          {/* Motivational Quote */}
          {motivationalQuote && (
            <motion.div
              style={{
                padding: '1.5rem',
                background: `linear-gradient(135deg, ${selectedMood?.color}20, ${selectedMood?.color}10)`,
                borderRadius: '2rem',
                marginBottom: '2rem',
                textAlign: 'center',
                border: `1px solid ${selectedMood?.color}40`
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p style={{
                fontSize: '1.125rem',
                color: '#1f2937',
                fontFamily: '"Gowun Dodum", cursive',
                margin: 0,
                fontStyle: 'italic'
              }}>
                {motivationalQuote}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '2rem',
            color: '#1f2937',
            fontFamily: '"Playwrite DE SAS", cursive',
            textAlign: 'center'
          }}>
            Your Mood Trend (Last 7 Days)
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontFamily: '"Gowun Dodum", cursive' }}
              />
              <YAxis 
                domain={[0, 5]} 
                stroke="#6b7280"
                style={{ fontFamily: '"Gowun Dodum", cursive' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#597c49ff" 
                strokeWidth={3}
                dot={{ fill: '#597c49ff', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#597c49ff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Stats View */}
      {viewMode === 'stats' && stats && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* Overview Stats */}
            <div style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#1f2937',
                fontFamily: '"Gowun dodum", cursive'
              }}>
                Overview
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(89, 124, 73, 0.1)',
                  borderRadius: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontFamily: '"Gowun Dodum", cursive' }}>Total Entries</span>
                  <strong>{stats.totalEntries}</strong>
                </div>
                
                <div style={{
                  padding: '1rem',
                  background: 'rgba(89, 124, 73, 0.1)',
                  borderRadius: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontFamily: '"Gowun Dodum", cursive' }}>Average Mood</span>
                  <strong>{stats.averageMood}/5</strong>
                </div>
                
                <div style={{
                  padding: '1rem',
                  background: 'rgba(89, 124, 73, 0.1)',
                  borderRadius: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontFamily: '"Gowun Dodum", cursive' }}>Most Common</span>
                  <strong>{stats.mostCommonMood}</strong>
                </div>
              </div>
            </div>

            {/* Mood Distribution */}
            <div style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#1f2937',
                fontFamily: '"Playwrite DE SAS", cursive'
              }}>
                Mood Distribution
              </h3>
              
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {stats.moodDistribution.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <span style={{
                      fontFamily: '"Gowun Dodum", cursive',
                      minWidth: '80px',
                      fontSize: '0.875rem'
                    }}>
                      {item.mood}
                    </span>
                    <div style={{
                      flex: 1,
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: '#597c49ff',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                    <span style={{
                      fontFamily: '"Gowun Dodum", cursive',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      minWidth: '40px'
                    }}>
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Journal Modal */}
      <AnimatePresence>
        {showJournal && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              zIndex: 50
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowJournal(false)}
          >
            <motion.div
              style={{
                background: 'white',
                borderRadius: '2rem',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  color: '#1f2937',
                  fontFamily: '"Gowun dodum", cursive',
                  margin: 0
                }}>
                  Journal Entry
                </h3>
                <button
                  onClick={() => setShowJournal(false)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#f3f4f6',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="How was your day? What are you grateful for? Write your thoughts here..."
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '1rem',
                  resize: 'vertical',
                  fontFamily: '"Gowun Dodum", cursive',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#597c49ff'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem'
              }}>
                <button
                  onClick={() => setShowJournal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '1rem',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    cursor: 'pointer',
                    fontFamily: '"Gowun Dodum", cursive'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleJournalSave}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: '#597c49ff',
                    color: 'white',
                    borderRadius: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: '"Gowun Dodum", cursive'
                  }}
                >
                  <Save size={18} />
                  Save Entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodTrackerPage;