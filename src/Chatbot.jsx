import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaHeart, FaBrain, FaLightbulb } from "react-icons/fa";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  z-index: 2000;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: grab;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #f8fafc;
`;

const MessageBubble = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: ${fadeIn} 0.3s ease;
`;

const BotAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #597c49ff 0%, #669751ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  background: ${props => props.isBot ? '#e2e8f0' : 'linear-gradient(135deg, #597c49ff 0%, #669751ff 100%)'};
  color: ${props => props.isBot ? '#1e293b' : 'white'};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 80%;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #e2e8f0;
  border-radius: 18px;
  max-width: 80px;
`;

const TypingDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: #64748b;
  border-radius: 50%;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #667eea;
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

const SendButton = styled(motion.button)`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const QuickActionButton = styled(motion.button)`
  padding: 8px 12px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    transform: translateY(-1px);
  }
`;

// Mental Health Response System
const mentalHealthResponses = {
  crisis: [
    "I'm concerned about what you're sharing. Please reach out to a mental health professional immediately. You can call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 for crisis support.",
    "Your safety is the most important thing right now. Please contact emergency services (911) or a crisis hotline immediately. You're not alone, and help is available.",
    "I'm worried about you. Please seek immediate professional help. Contact your local emergency services or call the National Suicide Prevention Lifeline at 988."
  ],
  anxiety: [
    "I understand anxiety can feel overwhelming. Try taking slow, deep breaths and focus on the present moment. Remember, this feeling will pass.",
    "Anxiety is a natural response, but it doesn't have to control you. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
    "When anxiety strikes, try box breathing: inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat until you feel calmer."
  ],
  depression: [
    "I hear that you're struggling, and I want you to know that your feelings are valid. Depression is treatable, and you don't have to face this alone.",
    "It takes courage to share how you're feeling. Consider reaching out to a mental health professional who can provide the support you deserve.",
    "Depression can make everything feel hopeless, but this is temporary. Small steps like getting sunlight, staying hydrated, and maintaining a routine can help."
  ],
  stress: [
    "Stress is your body's response to pressure, and it's completely normal. Try breaking large tasks into smaller, manageable steps.",
    "When stressed, try progressive muscle relaxation: tense and then relax each muscle group from your toes to your head.",
    "Remember to take breaks and practice self-care. Even 5 minutes of deep breathing can help reset your nervous system."
  ],
  sleep: [
    "Sleep issues can really impact your well-being. Try establishing a consistent bedtime routine and avoid screens 1 hour before bed.",
    "If you're having trouble sleeping, try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. This can help calm your mind.",
    "Consider creating a sleep-friendly environment: cool, dark, and quiet. A regular sleep schedule can also make a big difference."
  ],
  selfCare: [
    "Self-care isn't selfish—it's essential. Start with small acts like drinking water, taking a walk, or doing something you enjoy.",
    "Remember the basics: eat nourishing food, get some movement, stay hydrated, and try to get adequate sleep. These foundations support everything else.",
    "Self-care looks different for everyone. Find what brings you joy and peace, whether it's reading, music, nature, or connecting with loved ones."
  ],
  greetings: [
    "Hello! I'm your mental health support companion. I'm here to listen and help you through difficult times. How are you feeling today?",
    "Hi there! I'm here to support your mental wellness journey. What's on your mind today?",
    "Welcome! I'm your mental health companion, ready to listen and provide support. How can I help you today?"
  ],
  default: [
    "I'm here to listen and support you. Can you tell me more about what you're experiencing?",
    "Thank you for sharing with me. Your feelings are important, and I want to help you work through them.",
    "I understand this might be difficult to talk about. Take your time, and know that I'm here to support you.",
    "Your mental health matters, and I'm glad you're reaching out. What would be most helpful for you right now?"
  ]
};

const keywordMap = {
  crisis: ['suicide', 'kill myself', 'end it all', 'not worth living', 'want to die', 'hurt myself', 'self harm'],
  anxiety: ['anxious', 'anxiety', 'panic', 'worried', 'nervous', 'scared', 'fear', 'overwhelmed'],
  depression: ['depressed', 'depression', 'sad', 'hopeless', 'empty', 'worthless', 'useless', 'down'],
  stress: ['stressed', 'stress', 'pressure', 'overwhelmed', 'burnout', 'exhausted', 'tired'],
  sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'can\'t sleep', 'wake up', 'nightmares'],
  selfCare: ['self care', 'self-care', 'tired', 'exhausted', 'burnout', 'overwhelmed', 'need help']
};

export default function ChatbotPopup({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your mental health support companion. I'm here to listen and help you through difficult times. How are you feeling today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for crisis keywords first
    if (keywordMap.crisis.some(keyword => message.includes(keyword))) {
      return mentalHealthResponses.crisis[Math.floor(Math.random() * mentalHealthResponses.crisis.length)];
    }
    
    // Check for other keywords
    for (const [category, keywords] of Object.entries(keywordMap)) {
      if (category === 'crisis') continue;
      if (keywords.some(keyword => message.includes(keyword))) {
        return mentalHealthResponses[category][Math.floor(Math.random() * mentalHealthResponses[category].length)];
      }
    }
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return mentalHealthResponses.greetings[Math.floor(Math.random() * mentalHealthResponses.greetings.length)];
    }
    
    // Default response
    return mentalHealthResponses.default[Math.floor(Math.random() * mentalHealthResponses.default.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickActions = [
    "I'm feeling stressed",
    "I'm anxious",
    "I can't sleep",
    "I feel sad",
    "Academic pressure",
    "Relationship issues",
    "Self-care tips",
    "Need resources"
  ];

  const handleQuickAction = (action) => {
    setInputValue(action);
    handleSendMessage();
  };

  return (
    <Overlay
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <HeaderInfo>
          <FaHeart />
          <HeaderTitle>Mental Health Support</HeaderTitle>
          <StatusIndicator />
        </HeaderInfo>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </Header>

      <MessagesContainer>
        {messages.map((message) => (
          <MessageBubble key={message.id}>
            {message.isBot ? (
              <BotAvatar>
                <FaHeart />
              </BotAvatar>
            ) : (
              <UserAvatar>
                <FaUser />
              </UserAvatar>
            )}
            <MessageContent isBot={message.isBot}>
              {message.text}
            </MessageContent>
          </MessageBubble>
        ))}
        
        {isTyping && (
          <MessageBubble>
            <BotAvatar>
              <FaHeart />
            </BotAvatar>
            <TypingIndicator>
              <TypingDot
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <TypingDot
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <TypingDot
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </TypingIndicator>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <MessageInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <SendButton 
          onClick={handleSendMessage} 
          disabled={isTyping || !inputValue.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPaperPlane />
        </SendButton>
      </InputContainer>

      {messages.length === 1 && (
        <div style={{ padding: '0 20px 15px' }}>
          <QuickActions>
            {quickActions.map((action, index) => (
              <QuickActionButton 
                key={index} 
                onClick={() => handleQuickAction(action)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {action}
              </QuickActionButton>
            ))}
          </QuickActions>
        </div>
      )}
    </Overlay>
  );
}