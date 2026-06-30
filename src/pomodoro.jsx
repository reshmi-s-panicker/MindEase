import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const modes = {
    focus: { duration: 25 * 60, label: 'Focus Time', icon: Brain },
    shortBreak: { duration: 5 * 60, label: 'Short Break', icon: Coffee },
    longBreak: { duration: 15 * 60, label: 'Long Break', icon: Coffee }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      setIsActive(false);
      if (mode === 'focus') {
        setSessions(prev => prev + 1);
        // Auto-switch to break
        const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(modes[nextMode].duration);
      } else {
        // Break completed, switch back to focus
        setMode('focus');
        setTimeLeft(modes.focus.duration);
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, mode, sessions]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
  const CurrentIcon = modes[mode].icon;

  return (
    <div style={{ 
    display: 'flex',
    justifyContent: 'center', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#f6ffef',
    minHeight: 'auto',
    boxSizing: 'border-box' // ensure padding doesn't overflow
    }}>
    <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 20px 40px rgba(122, 164, 102, 0.1)',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
    }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <CurrentIcon 
              size={32} 
              style={{ color: '#7aa466' }} 
            />
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#2d2d2d',
              margin: 0
            }}>
              {modes[mode].label}
            </h1>
          </div>
          
          {sessions > 0 && (
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: 0
            }}>
              Session {sessions} completed
            </p>
          )}
        </div>

        {/* Mode Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '40px',
          background: '#f8f8f8',
          padding: '6px',
          borderRadius: '12px'
        }}>
          {Object.entries(modes).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                background: mode === key ? '#7aa466' : 'transparent',
                color: mode === key ? 'white' : '#666',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div style={{ marginBottom: '40px', position: 'relative' }}>
          {/* Animated Progress Ring */}
          <div style={{
            width: '280px',
            height: '280px',
            margin: '0 auto 24px',
            position: 'relative'
          }}>
            {/* Outer glow effect */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: isActive 
                ? `radial-gradient(circle, rgba(122, 164, 102, 0.1) 0%, rgba(122, 164, 102, 0.05) 50%, transparent 70%)`
                : 'transparent',
              animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none'
            }} />
            
            <svg
              width="280"
              height="280"
              style={{ 
                transform: 'rotate(-90deg)',
                filter: isActive ? 'drop-shadow(0 0 20px rgba(122, 164, 102, 0.3))' : 'none'
              }}
            >
              {/* Background decorative circles */}
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8f8f8" />
                  <stop offset="100%" stopColor="#f0f0f0" />
                </linearGradient>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7aa466" />
                  <stop offset="50%" stopColor="#8db573" />
                  <stop offset="100%" stopColor="#7aa466" />
                </linearGradient>
              </defs>
              
              {/* Outer decorative ring */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="#f6ffef"
                strokeWidth="2"
                opacity="0.6"
              />
              
              {/* Main background circle */}
              <circle
                cx="140"
                cy="140"
                r="100"
                fill="none"
                stroke="url(#bgGradient)"
                strokeWidth="12"
              />
              
              {/* Animated waves around the circle */}
              {[...Array(3)].map((_, waveIndex) => {
                const radius = 110 + waveIndex * 8;
                const points = 60; // More points for smoother waves
                const pathData = [...Array(points)].map((_, i) => {
                  const angle = (i / points) * 2 * Math.PI;
                  const waveOffset = Math.sin(angle * 4 + waveIndex * 0.5) * 3; // Wave amplitude
                  const x = 140 + (radius + waveOffset) * Math.cos(angle);
                  const y = 140 + (radius + waveOffset) * Math.sin(angle);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ') + ' Z';
                
                return (
                  <path
                    key={waveIndex}
                    d={pathData}
                    fill="none"
                    stroke="#7aa466"
                    strokeWidth="2"
                    opacity={isActive ? 0.3 - waveIndex * 0.1 : 0.05}
                    style={{
                      animation: isActive ? `wave 3s ease-in-out ${waveIndex * 0.3}s infinite` : 'none'
                    }}
                  />
                );
              })}
              
              {/* Flowing particles on the wave */}
              {isActive && [...Array(6)].map((_, i) => {
                const angle = (Date.now() * 0.001 + i * 60) % 360;
                const radians = (angle * Math.PI) / 180;
                const waveOffset = Math.sin(radians * 4) * 3;
                const x = 140 + (118 + waveOffset) * Math.cos(radians);
                const y = 140 + (118 + waveOffset) * Math.sin(radians);
                
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#7aa466"
                    opacity="0.6"
                    style={{
                      animation: `particleFlow 4s linear ${i * 0.7}s infinite`
                    }}
                  />
                );
              })}
              
              {/* Main progress circle */}
              <circle
                cx="140"
                cy="140"
                r="100"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
                style={{ 
                  transition: 'stroke-dashoffset 1s ease',
                  filter: isActive ? 'brightness(1.1)' : 'brightness(1)'
                }}
              />
              

            </svg>
            
            {/* Time Display with enhanced styling */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '52px',
                fontWeight: '300',
                color: '#2d2d2d',
                fontFamily: 'monospace',
                marginBottom: '8px',
                textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                animation: isActive && timeLeft <= 10 ? 'urgentPulse 1s ease-in-out infinite' : 'none'
              }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{
                fontSize: '14px',
                color: isActive ? '#7aa466' : '#888',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}>
                {isActive ? 'Active' : 'Paused'}
              </div>
              
              {/* Breathing indicator for focus mode */}
              {mode === 'focus' && isActive && (
                <div style={{
                  marginTop: '12px',
                  width: '8px',
                  height: '8px',
                  background: '#7aa466',
                  borderRadius: '50%',
                  margin: '12px auto 0',
                  animation: 'breathe 4s ease-in-out infinite'
                }} />
              )}
            </div>
            
            {/* CSS animations */}
            <style>
              {`
                @keyframes pulse {
                  0%, 100% { transform: scale(1); opacity: 0.3; }
                  50% { transform: scale(1.05); opacity: 0.6; }
                }
                
                @keyframes waveBlob {
                  0%, 100% { 
                    transform: rotate(0deg) scale(1);
                  }
                  25% { 
                    transform: rotate(90deg) scale(1.05);
                  }
                  50% { 
                    transform: rotate(180deg) scale(0.95);
                  }
                  75% { 
                    transform: rotate(270deg) scale(1.02);
                  }
                }
                
                @keyframes progressDot {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.2); }
                }
                
                @keyframes urgentPulse {
                  0%, 100% { color: #2d2d2d; }
                  50% { color: #d73027; }
                }
                
                @keyframes breathe {
                  0%, 100% { transform: scale(1); opacity: 0.6; }
                  50% { transform: scale(1.5); opacity: 1; }
                }
              `}
            </style>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            onClick={resetTimer}
            style={{
              width: '56px',
              height: '56px',
              border: '2px solid #e0e0e0',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#666'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#7aa466';
              e.target.style.color = '#7aa466';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.color = '#666';
            }}
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={toggleTimer}
            style={{
              width: '80px',
              height: '80px',
              border: 'none',
              borderRadius: '50%',
              background: '#7aa466',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 24px rgba(122, 164, 102, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isActive ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '2px' }} />}
          </button>

          <div style={{ width: '56px' }}></div> {/* Spacer for symmetry */}
        </div>

        {/* Motivational Text */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: '#f6ffef',
          borderRadius: '12px',
          border: '1px solid #e8f5e0'
        }}>
          <p style={{
            color: '#5d7a52',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: 0,
            fontStyle: 'italic'
          }}>
            {mode === 'focus' 
              ? "Focus on one task at a time. Your mind deserves this dedicated attention."
              : "Take this moment to breathe and rest. You're doing great."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;