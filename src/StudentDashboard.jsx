import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ChatbotPopup from "./Chatbot";
import { FaHeart, FaBrain, FaLeaf, FaSun, FaMoon, FaQuoteLeft } from "react-icons/fa";

// --- Animations ---
const jump = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-40px); }
  60% { transform: translateY(-20px); }
`;

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(89, 124, 73, 0.3); }
  50% { box-shadow: 0 0 40px rgba(89, 124, 73, 0.6); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// --- Styled Components ---
const Container = styled.div`
  height: 100vh;
  padding: 0;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 50%, #d5ecd5 100%);
  font-family: "Quicksand", sans-serif;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
`;

const TopSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 30px 0;
  text-align: center;
  position: relative;
`;

const QuoteContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto 20px;
  position: relative;
`;

const Quote = styled.h2`
  font-family: "Gowun Dodum", cursive;
  font-size: 1.8rem;
  color: #597c49ff;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  position: relative;
  padding: 0 40px;

  &::before, &::after {
    content: '"';
    font-size: 2.5rem;
    color: rgba(89, 124, 73, 0.4);
    position: absolute;
    top: -10px;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const WellnessStats = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const StatItem = styled(motion.div)`
  background: rgba(89, 124, 73, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #597c49ff;
  font-weight: 600;
  border: 1px solid rgba(89, 124, 73, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(89, 124, 73, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(89, 124, 73, 0.15);
  }

  svg {
    font-size: 1.2rem;
    color: #669751ff;
  }
`;

const ContentArea = styled.div`
  padding: 40px 30px 100px 30px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  min-height: calc(100vh - 200px);
`;

const MascotWrapper = styled(motion.div)`
  position: absolute;
  top: ${({ isChatbot }) => (isChatbot ? "auto" : "35%")};
  bottom: ${({ isChatbot }) => (isChatbot ? "20px" : "auto")};
  left: ${({ isChatbot }) => (isChatbot ? "auto" : "50%")};
  right: ${({ isChatbot }) => (isChatbot ? "20px" : "auto")};
  transform: translateX(${({ isChatbot }) => (isChatbot ? "0" : "-50%")});
  cursor: pointer;
  animation: ${({ isChatbot }) => (isChatbot ? float : jump)} 2s ease infinite;
  z-index: 1000;

  img {
    width: ${({ isChatbot }) => (isChatbot ? "80px" : "150px")};
    height: auto;
    transition: all 0.8s ease;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 768px) {
    img {
      width: ${({ isChatbot }) => (isChatbot ? "60px" : "120px")};
    }
  }
`;

const Greeting = styled(motion.div)`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  backdrop-filter: blur(15px);
  padding: 30px 40px;
  border-radius: 25px;
  font-weight: 600;
  color: #597c49ff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  animation: ${glow} 2s ease infinite;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 25px 30px;
    width: 90%;
    max-width: 350px;
  }
`;

const Welcome = styled(motion.h1)`
  font-size: 2.8rem;
  color: #597c49ff;
  margin-bottom: 20px;
  text-align: center;
  font-family: "Gowun Dodum", cursive;
  font-weight: 700;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  color: #597c49ff;
  font-size: 1.2rem;
  margin-bottom: 40px;
  font-weight: 500;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
`;

const CardGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }
`;

const FeatureCard = styled(motion.div)`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 35px 25px;
  text-align: center;
  font-weight: 600;
  color: #597c49ff;
  box-shadow: 0 8px 32px rgba(89, 124, 73, 0.1);
  cursor: pointer;
  border: 1px solid rgba(89, 124, 73, 0.15);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(89, 124, 73, 0.1), 
      transparent
    );
    transition: all 0.6s;
  }

  &:hover {
    transform: translateY(-15px) scale(1.03);
    box-shadow: 0 20px 50px rgba(89, 124, 73, 0.2);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
    animation: ${breathe} 2s ease infinite;

    &::before {
      left: calc(100% + 200px);
      animation: ${shimmer} 1.5s ease infinite;
    }

    .card-icon {
      transform: scale(1.2) rotate(5deg);
      filter: drop-shadow(0 5px 15px rgba(89, 124, 73, 0.3));
    }

    .card-title {
      color: #669751ff;
      text-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);
    }
  }

  .card-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    transition: all 0.4s ease;
    filter: drop-shadow(0 4px 8px rgba(89, 124, 73, 0.15));
  }

  .card-title {
    font-size: 1.3rem;
    margin-bottom: 10px;
    transition: all 0.3s ease;
    font-family: "Gowun Dodum", cursive;
  }

  .card-description {
    font-size: 0.9rem;
    opacity: 0.7;
    line-height: 1.4;
    margin-top: 10px;
    color: #597c49ff;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: rgba(89, 124, 73, 0.08);
  font-size: 2rem;
  animation: ${float} 6s ease-in-out infinite;
`;

// --- React Component ---
function Dashboard({ userName }) {
  const [name, setName] = useState(userName || "Student");
  const [showGreeting, setShowGreeting] = useState(false);
  const [isChatbot, setIsChatbot] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const navigate = useNavigate();

  const quotes = [
    "Your mental health is just as important as your physical health",
    "Progress, not perfection, is the goal of mental wellness",
    "Taking care of your mind is the greatest investment you can make",
    "Every step towards mental wellness is a victory worth celebrating"
  ];

  const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.name) setName(u.name);
      }
    } catch {}
  }, []);

  useEffect(() => {
  const hasVisited = sessionStorage.getItem("hasGreeted");

  if (!hasVisited) {
    // First visit
    setShowGreeting(true);
    setIsChatbot(false); // mascot starts waving

    // Step 1: hide greeting after 3s
    const greetingTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 3000);

    // Step 2: switch mascot AFTER greeting is gone
    const mascotTimer = setTimeout(() => {
      setIsChatbot(true);
    }, 4000);

    // Step 3: show dashboard content after mascot settles
    const cardTimer = setTimeout(() => {
      setShowCards(true);
      sessionStorage.setItem("hasGreeted", "true");
    }, 5000);

    return () => {
      clearTimeout(greetingTimer);
      clearTimeout(mascotTimer);
      clearTimeout(cardTimer);
    };
  } else {
    // Returning user
    setIsChatbot(true);
    setShowCards(true);
  }
}, []);

  const handleCardClick = (feature) => {
    if (feature.route) {
      navigate(feature.route);
    }
    // Add more feature navigations here if needed
  };

  const features = [
    { 
      title: "Pomodoro Timer", 
      img: "/assets/pomodoro.png", 
      route: "/pomodoro",
      description: "Boost focus with time management techniques"
    },
    { 
      title: "Breathe In-Out Exercises", 
      img: "/assets/breathe.png", 
      route: "/breathe",
      description: "Guided breathing for stress relief"
    },
    { 
      title: "Relaxing Videos", 
      img: "/assets/videos.png", 
      route: "/videos",
      description: "Calming content for peace of mind"
    },
    { 
      title: "Relaxing Music & Binaural Beats", 
      img: "/assets/music.png", 
      route: "/music",
      description: "Therapeutic sounds for relaxation"
    },
    { 
      title: "Mood Tracker & Journal", 
      img: "/assets/journal.png", 
      route: "/journal",
      description: "Reflect, track your moods, and improve well-being daily"
    },
    { 
      title: "Book Counselor", 
      img: "/assets/book.png", 
      route: "/book",
      description: "Connect with professional support"
    }
  ];

  return (
    <Container>
      {/* Floating Background Elements */}
      <FloatingElements>
        <FloatingIcon
          style={{ top: '10%', left: '10%' }}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaHeart />
        </FloatingIcon>
        <FloatingIcon
          style={{ top: '20%', right: '15%' }}
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaBrain />
        </FloatingIcon>
        <FloatingIcon
          style={{ bottom: '30%', left: '5%' }}
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaLeaf />
        </FloatingIcon>
      </FloatingElements>

      {/* Greeting */}
      <AnimatePresence>
        {showGreeting && (
          <Greeting
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Hello {name}! 👋
          </Greeting>
        )}
      </AnimatePresence>

      {/* Mascot */}
      {/* Mascot */}
<AnimatePresence mode="wait">
  {!showGreeting && (
    <MascotWrapper
        key={isChatbot ? "chatbot-wrapper" : "wave-wrapper"}
        isChatbot={isChatbot}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChatbot(true)} // <-- show chatbot on click
    >
      {isChatbot ? (
        <motion.div
          key="chatbot"
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "32px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <FaHeart />
        </motion.div>
      ) : (
        <motion.img
          key="wave"
          src="/assets/mascot-wave.gif"
          alt="Wellness Mascot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </MascotWrapper>
  )}
</AnimatePresence>

      {/* Top Section with Quote and Stats */}
      {showCards && (
        <TopSection>
          <QuoteContainer
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Quote>{currentQuote}</Quote>
          </QuoteContainer>

          <WellnessStats
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <StatItem whileHover={{ scale: 1.05 }}>
              <FaSun />
              <span>Today's Wellness</span>
            </StatItem>
            <StatItem whileHover={{ scale: 1.05 }}>
              <FaHeart />
              <span>Mental Health Tools</span>
            </StatItem>
            <StatItem whileHover={{ scale: 1.05 }}>
              <FaMoon />
              <span>Relaxation Zone</span>
            </StatItem>
          </WellnessStats>
        </TopSection>
      )}

      {/* Dashboard Content */}
      {showCards && (
        <ContentArea>
          <Welcome
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Welcome to your Wellness Hub, {name}!
          </Welcome>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Your journey to better mental health starts here. Choose a tool below to begin your wellness practice today.
          </Subtitle>

          <CardGrid
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { 
                transition: { 
                  staggerChildren: 0.15,
                  delayChildren: 1
                } 
              },
            }}
          >
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                variants={{ 
                  hidden: { opacity: 0, y: 50, scale: 0.9 }, 
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.175, 0.885, 0.32, 1.275]
                    }
                  } 
                }}
                onClick={() => handleCardClick(feature)}
                whileTap={{ scale: 0.95 }}
              >
                <img src={feature.img} alt={feature.title} className="card-icon" />
                <div className="card-title">{feature.title}</div>
                <div className="card-description">{feature.description}</div>
              </FeatureCard>
            ))}
          </CardGrid>
        </ContentArea>
      )}
      {showChatbot && <ChatbotPopup onClose={() => setShowChatbot(false)} />}
    </Container>
  );
}

export default Dashboard;