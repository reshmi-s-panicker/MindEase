import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Home, Moon, Waves, TreePine, CloudRain, Wind } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
  padding: 1rem;
`;

const Header = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  font-family: "Playwrite DE SAS", cursive;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  font-family: "Gowun Dodum", cursive;
`;

const HomeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #597c49ff;
  color: white;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Gowun Dodum", cursive;
  box-shadow: 0 4px 16px rgba(89, 124, 73, 0.3);

  &:hover {
    background: #669751ff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(89, 124, 73, 0.4);
  }
`;

const CurrentTrackContainer = styled(motion.div)`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TrackDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconContainer = styled.div`
  padding: 0.75rem;
  border-radius: 50%;
  color: white;
  background-color: ${props => props.color};
`;

const TrackText = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackName = styled.h3`
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  font-family: "Gowun Dodum", cursive;
`;

const TrackDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-family: "Gowun Dodum", cursive;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const VolumeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VolumeButton = styled.button`
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #1f2937;
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 6px;
  border-radius: 5px;
  background: #e5e7eb;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #597c49ff;
    cursor: pointer;
  }
`;

const PlayButton = styled.button`
  padding: 0.75rem;
  background: #597c49ff;
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(89, 124, 73, 0.3);

  &:hover {
    background: #669751ff;
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(89, 124, 73, 0.4);
  }
`;

const Section = styled(motion.div)`
  margin-bottom: ${props => props.marginBottom || '3rem'};
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-family: "Gowun Dodum", cursive;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.85);
  }
`;

const CardIcon = styled.div`
  padding: 1rem;
  border-radius: 50%;
  color: white;
  background-color: ${props => props.color};
  margin: 0 auto 1rem auto;
  width: fit-content;
`;

const CardTitle = styled.h3`
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin: 0 0 0.5rem 0;
  font-family: "Quicksand", cursive;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 1rem 0;
  font-family: "Quicksand", cursive;
`;

const CardButton = styled.button`
  padding: 0.75rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.active ? '#597c49ff' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#6b7280'};

  &:hover {
    background-color: ${props => props.active ? '#669751ff' : '#e5e7eb'};
    transform: scale(1.05);
  }
`;

const InstructionsContainer = styled(motion.div)`
  margin-top: 3rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.1);
`;

const InstructionsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  font-family: "Gowun Dodum", cursive;
`;

const InstructionsText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-family: "Quicksand", cursive;
  
  p {
    margin: 0 0 0.5rem 0;
    line-height: 1.6;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: #1f2937;
    font-weight: 600;
  }
`;

const RelaxationPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioContext = useRef(null);
  const oscillators = useRef([]);
  const gainNodes = useRef([]);

  // Binaural beat frequencies for different states
  const binauralBeats = [
    { 
      name: "Deep Relaxation", 
      baseFreq: 200, 
      beatFreq: 4, 
      icon: Moon,
      color: "#4A5568",
      description: "4Hz Theta waves for deep meditation"
    },
    { 
      name: "Stress Relief", 
      baseFreq: 220, 
      beatFreq: 8, 
      icon: Waves,
      color: "#2B6CB0",
      description: "8Hz Alpha waves to reduce stress"
    },
    { 
      name: "Anxiety Relief", 
      baseFreq: 180, 
      beatFreq: 6, 
      icon: Wind,
      color: "#38B2AC",
      description: "6Hz Theta waves for anxiety relief"
    },
    { 
      name: "Focus & Calm", 
      baseFreq: 240, 
      beatFreq: 10, 
      icon: TreePine,
      color: "#597c49ff",
      description: "10Hz Alpha waves for focused calm"
    }
  ];

  const ambientSounds = [
    {
      name: "Rain Sounds",
      icon: CloudRain,
      color: "#4299E1",
      description: "Gentle rainfall for relaxation"
    },
    {
      name: "Ocean Waves",
      icon: Waves,
      color: "#0BC5EA",
      description: "Calming ocean waves"
    },
    {
      name: "Forest Sounds",
      icon: TreePine,
      color: "#48BB78",
      description: "Peaceful forest ambience"
    },
    {
      name: "Wind Sounds",
      icon: Wind,
      color: "#A0AEC0",
      description: "Gentle wind through trees"
    }
  ];

  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    return () => {
      stopAudio();
    };
  }, []);

  const playBinauralBeat = (beat) => {
    stopAudio();
    
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }

    // Create left and right channel oscillators
    const leftOsc = audioContext.current.createOscillator();
    const rightOsc = audioContext.current.createOscillator();
    
    // Create gain nodes for volume control
    const leftGain = audioContext.current.createGain();
    const rightGain = audioContext.current.createGain();
    const masterGain = audioContext.current.createGain();

    // Create merger for stereo output
    const merger = audioContext.current.createChannelMerger(2);

    // Set frequencies (left ear gets base frequency, right ear gets base + beat frequency)
    leftOsc.frequency.setValueAtTime(beat.baseFreq, audioContext.current.currentTime);
    rightOsc.frequency.setValueAtTime(beat.baseFreq + beat.beatFreq, audioContext.current.currentTime);

    // Set waveform to sine wave
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';

    // Set initial volume
    const vol = isMuted ? 0 : volume * 0.1; // Keep binaural beats quiet
    leftGain.gain.setValueAtTime(vol, audioContext.current.currentTime);
    rightGain.gain.setValueAtTime(vol, audioContext.current.currentTime);
    masterGain.gain.setValueAtTime(1, audioContext.current.currentTime);

    // Connect the audio graph
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(masterGain);
    masterGain.connect(audioContext.current.destination);

    // Start oscillators
    leftOsc.start();
    rightOsc.start();

    // Store references for cleanup
    oscillators.current = [leftOsc, rightOsc];
    gainNodes.current = [leftGain, rightGain, masterGain];

    setCurrentTrack(beat);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    oscillators.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillators.current = [];
    gainNodes.current = [];
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const togglePlay = (track) => {
    if (isPlaying && currentTrack?.name === track.name) {
      stopAudio();
    } else {
      if (track.beatFreq) {
        playBinauralBeat(track);
      } else {
        // For ambient sounds, we'll simulate with white noise
        // In a real app, you'd load actual audio files
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (gainNodes.current.length > 0) {
      const vol = isMuted ? 0 : newVolume * 0.1;
      gainNodes.current[0].gain.setValueAtTime(vol, audioContext.current.currentTime);
      gainNodes.current[1].gain.setValueAtTime(vol, audioContext.current.currentTime);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gainNodes.current.length > 0) {
      const vol = !isMuted ? 0 : volume * 0.1;
      gainNodes.current[0].gain.setValueAtTime(vol, audioContext.current.currentTime);
      gainNodes.current[1].gain.setValueAtTime(vol, audioContext.current.currentTime);
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeaderContent>
          <Title>Mind Ease</Title>
          <Subtitle>Relaxation & Binaural Beats</Subtitle>
        </HeaderContent>
        
        <HomeButton onClick={() => window.history.back()}>
          <Home size={18} />
          Home
        </HomeButton>
      </Header>

      {/* Current Playing */}
      <AnimatePresence>
        {currentTrack && (
          <CurrentTrackContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrackInfo>
              <TrackDetails>
                <IconContainer color={currentTrack.color}>
                  <currentTrack.icon size={24} />
                </IconContainer>
                <TrackText>
                  <TrackName>{currentTrack.name}</TrackName>
                  <TrackDescription>{currentTrack.description}</TrackDescription>
                </TrackText>
              </TrackDetails>
              
              <Controls>
                {/* Volume Control */}
                <VolumeControls>
                  <VolumeButton onClick={toggleMute}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </VolumeButton>
                  <VolumeSlider
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  />
                </VolumeControls>
                
                <PlayButton onClick={() => togglePlay(currentTrack)}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </PlayButton>
              </Controls>
            </TrackInfo>
          </CurrentTrackContainer>
        )}
      </AnimatePresence>

      {/* Binaural Beats Section */}
      <Section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SectionTitle>Binaural Beats</SectionTitle>
        <Grid>
          {binauralBeats.map((beat, index) => (
            <Card
              key={beat.name}
              onClick={() => togglePlay(beat)}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardIcon color={beat.color}>
                <beat.icon size={32} />
              </CardIcon>
              <CardTitle>{beat.name}</CardTitle>
              <CardDescription>{beat.description}</CardDescription>
              
              <CardButton 
                active={isPlaying && currentTrack?.name === beat.name}
              >
                {isPlaying && currentTrack?.name === beat.name ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} />
                )}
              </CardButton>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* Ambient Sounds Section */}
      <Section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SectionTitle>Ambient Sounds</SectionTitle>
        <Grid>
          {ambientSounds.map((sound, index) => (
            <Card
              key={sound.name}
              onClick={() => togglePlay(sound)}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardIcon color={sound.color}>
                <sound.icon size={32} />
              </CardIcon>
              <CardTitle>{sound.name}</CardTitle>
              <CardDescription>{sound.description}</CardDescription>
              
              <CardButton 
                active={isPlaying && currentTrack?.name === sound.name}
              >
                {isPlaying && currentTrack?.name === sound.name ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} />
                )}
              </CardButton>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* Instructions */}
      <InstructionsContainer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <InstructionsTitle>How to Use</InstructionsTitle>
        <InstructionsText>
          <p><strong>Binaural Beats:</strong> Use headphones for best effect. These generate different frequencies in each ear to promote specific brainwave states.</p>
          <p><strong>Volume:</strong> Keep volume at a comfortable, low level. The beats should be subtle and not overwhelming.</p>
          <p><strong>Duration:</strong> Listen for 15-30 minutes for optimal benefits. Find a quiet space and close your eyes for deeper relaxation.</p>
        </InstructionsText>
      </InstructionsContainer>
    </Container>
  );
};

export default RelaxationPage;