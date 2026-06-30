import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Waves, Heart } from 'lucide-react';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale', 'pause'
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [technique, setTechnique] = useState('4-4-4-4'); // Different breathing techniques
  const intervalRef = useRef(null);

  const techniques = {
    '4-4-4-4': { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, name: 'Box Breathing' },
    '4-7-8': { inhale: 4, holdIn: 7, exhale: 8, holdOut: 2, name: '4-7-8 Technique' },
    '6-2-6-2': { inhale: 6, holdIn: 2, exhale: 6, holdOut: 2, name: 'Calm Breathing' },
    '3-3-3-3': { inhale: 3, holdIn: 3, exhale: 3, holdOut: 3, name: 'Quick Relief' }
  };

  const currentTechnique = techniques[technique];
  const phaseMap = {
    inhale: { duration: currentTechnique.inhale, next: 'hold', action: 'Breathe In' },
    hold: { duration: currentTechnique.holdIn, next: 'exhale', action: 'Hold' },
    exhale: { duration: currentTechnique.exhale, next: 'pause', action: 'Breathe Out' },
    pause: { duration: currentTechnique.holdOut, next: 'inhale', action: 'Pause' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Move to next phase
      const nextPhase = phaseMap[phase].next;
      setPhase(nextPhase);
      setTimeLeft(phaseMap[nextPhase].duration);
      
      // Complete a cycle when returning to inhale
      if (nextPhase === 'inhale') {
        setCycles(prev => prev + 1);
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, phase]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(currentTechnique.inhale);
    setCycles(0);
  };

  const changeTechnique = (newTechnique) => {
    setIsActive(false);
    setTechnique(newTechnique);
    setPhase('inhale');
    setTimeLeft(techniques[newTechnique].inhale);
    setCycles(0);
  };

  // Calculate breathing circle scale based on phase and time
  const getBreathingScale = () => {
    const progress = (phaseMap[phase].duration - timeLeft) / phaseMap[phase].duration;
    
    switch (phase) {
      case 'inhale':
        return 0.6 + (progress * 0.4); // Scale from 0.6 to 1.0
      case 'hold':
        return 1.0; // Stay at full size
      case 'exhale':
        return 1.0 - (progress * 0.4); // Scale from 1.0 to 0.6
      case 'pause':
        return 0.6; // Stay at minimum size
      default:
        return 0.6;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return '#7aa466';
      case 'hold':
        return '#8db573';
      case 'exhale':
        return '#6b9654';
      case 'pause':
        return '#5d7a4f';
      default:
        return '#7aa466';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f6ffef 0%, #edf7e5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '32px',
        padding: '48px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 25px 50px rgba(122, 164, 102, 0.15)',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <Waves size={28} style={{ color: '#7aa466' }} />
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#2d2d2d',
              margin: 0
            }}>
              Breathing Exercise
            </h1>
          </div>
          
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: '8px 0 0 0'
          }}>
            {currentTechnique.name} • {cycles} cycles completed
          </p>
        </div>

        {/* Technique Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '40px',
          background: '#f8fdf6',
          padding: '8px',
          borderRadius: '16px',
          border: '1px solid #e8f5e0'
        }}>
          {Object.entries(techniques).map(([key, tech]) => (
            <button
              key={key}
              onClick={() => changeTechnique(key)}
              style={{
                padding: '12px 8px',
                border: 'none',
                borderRadius: '12px',
                background: technique === key ? '#7aa466' : 'transparent',
                color: technique === key ? 'white' : '#666',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>{tech.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>{key.replace('-', '-')}</div>
            </button>
          ))}
        </div>

        {/* Breathing Visualization */}
        <div style={{ marginBottom: '40px', position: 'relative' }}>
          <div style={{
            width: '320px',
            height: '320px',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer ripple rings */}
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                style={{
                  position: 'absolute',
                  width: `${280 + ring * 20}px`,
                  height: `${280 + ring * 20}px`,
                  border: `2px solid ${getPhaseColor()}`,
                  borderRadius: '50%',
                  opacity: isActive ? 0.1 - ring * 0.02 : 0.05,
                  animation: isActive ? `ripple 3s ease-in-out ${ring * 0.5}s infinite` : 'none'
                }}
              />
            ))}
            
            {/* Main breathing circle */}
            <div
              style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${getPhaseColor()}, ${getPhaseColor()}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${getBreathingScale()})`,
                transition: isActive ? `transform ${phase === 'hold' || phase === 'pause' ? '0.5s' : '1s'} ease-in-out` : 'transform 0.5s ease',
                boxShadow: `0 20px 60px ${getPhaseColor()}33`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Animated gradient overlay */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `conic-gradient(from 0deg, transparent, ${getPhaseColor()}22, transparent)`,
                borderRadius: '50%',
                animation: isActive ? 'rotate 8s linear infinite' : 'none'
              }} />
              
              {/* Center content */}
              <div style={{
                textAlign: 'center',
                zIndex: 2,
                color: 'white'
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '300',
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {timeLeft}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}>
                  {phaseMap[phase].action}
                </div>
              </div>
              
              {/* Breathing indicator particles */}
              {isActive && [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '50%',
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${i * 60}deg) translate(80px, -3px)`,
                    animation: `breatheParticles 3s ease-in-out ${i * 0.2}s infinite`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <button
            onClick={resetBreathing}
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
            onClick={toggleBreathing}
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
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(122, 164, 102, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 12px 40px rgba(122, 164, 102, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 32px rgba(122, 164, 102, 0.4)';
            }}
          >
            {isActive ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '2px' }} />}
          </button>

          <div style={{ width: '56px' }}></div>
        </div>

        {/* Guidance Text */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #f6ffef, #edf7e5)',
          borderRadius: '16px',
          border: '1px solid #e8f5e0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <Heart size={16} style={{ color: '#7aa466' }} />
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#5d7a52',
              margin: 0
            }}>
              Breathing Guidance
            </h3>
          </div>
          <p style={{
            color: '#5d7a52',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0,
            textAlign: 'left'
          }}>
            Follow the expanding and contracting circle. {phase === 'inhale' && 'Slowly fill your lungs with air through your nose.'} 
            {phase === 'hold' && 'Hold the breath gently, stay relaxed.'} 
            {phase === 'exhale' && 'Release the air slowly through your mouth.'} 
            {phase === 'pause' && 'Rest naturally before the next breath.'}
          </p>
        </div>

        {/* CSS Animations */}
        <style>
          {`
            @keyframes ripple {
              0%, 100% { transform: scale(0.8); opacity: 0.1; }
              50% { transform: scale(1.1); opacity: 0.05; }
            }
            
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes breatheParticles {
              0%, 100% { transform: rotate(0deg) translate(80px, -3px) scale(0.5); opacity: 0.3; }
              50% { transform: rotate(180deg) translate(90px, -3px) scale(1); opacity: 0.8; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default BreathingExercise;