import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaHeart, FaBrain, FaLightbulb } from 'react-icons/fa';

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
const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
`;

const ChatbotButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  animation: ${pulse} 2s infinite;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
  }
`;

const ChatbotWindow = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

const ChatbotHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8fafc;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
`;

const Message = styled(motion.div)`
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
`;

const BotAvatar = styled(MessageAvatar)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const UserAvatar = styled(MessageAvatar)`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
`;

const MessageContent = styled.div`
  background: ${props => props.isBot ? '#e0e7ff' : '#f0f9ff'};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 250px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
  color: #374151;
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  text-align: ${props => props.isBot ? 'left' : 'right'};
`;

const InputContainer = styled.div`
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  padding: 10px 15px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const QuickActionButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #374151;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  
  div {
    width: 6px;
    height: 6px;
    background: #9ca3af;
    border-radius: 50%;
    animation: ${pulse} 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
`;

// Mental Health Responses
const mentalHealthResponses = {
  greetings: [
    "Hello! I'm here to support your mental health journey. How are you feeling today?",
    "Hi there! I'm your mental health companion. What's on your mind?",
    "Welcome! I'm here to listen and help. How can I support you today?"
  ],
  stress: [
    "I understand you're feeling stressed. Try taking 5 deep breaths and remember: this feeling is temporary. Would you like some stress management techniques?",
    "Stress is a normal part of life, but it's important to manage it. Let's work through some coping strategies together.",
    "It sounds like you're going through a tough time. Remember, it's okay to feel overwhelmed. What specific situation is causing you stress?"
  ],
  anxiety: [
    "Anxiety can feel overwhelming, but you're not alone. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
    "Anxiety is your body's way of trying to protect you. Let's work on some calming techniques together.",
    "When anxiety feels intense, try box breathing: inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat until you feel calmer."
  ],
  depression: [
    "I'm sorry you're feeling this way. Depression can make everything feel heavy, but remember that your feelings are valid and temporary.",
    "It takes courage to talk about depression. You're already taking a positive step by reaching out. Have you considered speaking with a counselor?",
    "Depression can feel isolating, but you're not alone. Small steps matter - even getting out of bed is an achievement."
  ],
  sleep: [
    "Sleep issues can really affect your mental health. Try establishing a bedtime routine: no screens 1 hour before bed, keep your room cool and dark.",
    "Poor sleep can make everything feel harder. Consider trying relaxation techniques before bed, like gentle stretching or meditation.",
    "Sleep is crucial for mental health. If you're having persistent sleep problems, it might be worth discussing with a healthcare provider."
  ],
  academic: [
    "Academic pressure can be overwhelming. Remember, your worth isn't determined by your grades. Break tasks into smaller, manageable pieces.",
    "It's normal to feel stressed about academics. Try the Pomodoro technique: 25 minutes of focused work, then a 5-minute break.",
    "Academic stress is common, but it doesn't have to control your life. What specific academic challenges are you facing?"
  ],
  relationships: [
    "Relationships can be complex and emotionally challenging. Remember that healthy relationships involve mutual respect and communication.",
    "It's okay to set boundaries in relationships. Your mental health comes first. Would you like to talk about what's bothering you?",
    "Relationship issues can deeply affect our mental health. Remember, you deserve to be treated with kindness and respect."
  ],
  selfCare: [
    "Self-care isn't selfish - it's essential! Try to do one thing today that brings you joy, even if it's small.",
    "Self-care looks different for everyone. It could be taking a walk, reading, calling a friend, or simply resting. What feels good to you?",
    "Remember the basics: eat regularly, stay hydrated, get some fresh air, and be gentle with yourself."
  ],
  crisis: [
    "If you're having thoughts of self-harm, please reach out to a crisis helpline immediately. In India, you can call 1800-599-0019 (KIRAN Mental Health Helpline).",
    "Your safety is the most important thing. If you're in immediate danger, please contact emergency services or go to your nearest hospital.",
    "You matter, and there are people who want to help. Please reach out to a trusted friend, family member, or mental health professional."
  ],
  resources: [
    "Here are some helpful resources: KIRAN Mental Health Helpline (1800-599-0019), iCall (9152987821), and your college counseling center.",
    "Consider reaching out to your college's mental health services, or speak with a trusted professor or counselor.",
    "Remember, seeking professional help is a sign of strength, not weakness. You deserve support."
  ],
  default: [
    "I'm here to listen and support you. Can you tell me more about what you're experiencing?",
    "That sounds challenging. I'm glad you're reaching out. How can I best support you right now?",
    "Thank you for sharing that with me. Remember, it's okay to not be okay sometimes. What would be most helpful for you right now?"
  ]
};

// Keywords for response matching
const keywordMap = {
  stress: ['stress', 'stressed', 'pressure', 'overwhelmed', 'busy'],
  anxiety: ['anxiety', 'anxious', 'worry', 'worried', 'panic', 'nervous'],
  depression: ['depression', 'depressed', 'sad', 'hopeless', 'empty', 'down'],
  sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'rest'],
  academic: ['study', 'exam', 'grades', 'assignment', 'college', 'university'],
  relationships: ['relationship', 'friend', 'family', 'boyfriend', 'girlfriend', 'partner'],
  selfCare: ['self-care', 'self care', 'tired', 'burnout', 'exhausted'],
  crisis: ['suicide', 'self-harm', 'hurt myself', 'end it all', 'not worth living'],
  resources: ['help', 'support', 'counselor', 'therapy', 'professional']
};

const MentalHealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <ChatbotContainer>
      <AnimatePresence>
        {isOpen && (
          <ChatbotWindow
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatbotHeader>
              <HeaderInfo>
                <FaRobot />
                <HeaderTitle>Mental Health Support</HeaderTitle>
                <StatusIndicator />
              </HeaderInfo>
              <CloseButton onClick={() => setIsOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ChatbotHeader>

            <MessagesContainer>
              {messages.map((message) => (
                <Message key={message.id}>
                  {message.isBot ? (
                    <BotAvatar>
                      <FaRobot />
                    </BotAvatar>
                  ) : (
                    <UserAvatar>
                      <FaUser />
                    </UserAvatar>
                  )}
                  <div>
                    <MessageContent isBot={message.isBot}>
                      {message.text}
                    </MessageContent>
                    <MessageTime isBot={message.isBot}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </MessageTime>
                  </div>
                </Message>
              ))}
              
              {isTyping && (
                <TypingIndicator>
                  <BotAvatar>
                    <FaRobot />
                  </BotAvatar>
                  <div>
                    <MessageContent isBot={true}>
                      <TypingDots>
                        <div></div>
                        <div></div>
                        <div></div>
                      </TypingDots>
                    </MessageContent>
                  </div>
                </TypingIndicator>
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
              <SendButton onClick={handleSendMessage} disabled={isTyping || !inputValue.trim()}>
                <FaPaperPlane />
              </SendButton>
            </InputContainer>

            {messages.length === 1 && (
              <div style={{ padding: '0 20px 15px' }}>
                <QuickActions>
                  {quickActions.map((action, index) => (
                    <QuickActionButton key={index} onClick={() => handleQuickAction(action)}>
                      {action}
                    </QuickActionButton>
                  ))}
                </QuickActions>
              </div>
            )}
          </ChatbotWindow>
        )}
      </AnimatePresence>

      <ChatbotButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaHeart />
      </ChatbotButton>
    </ChatbotContainer>
  );
};

export default MentalHealthChatbot;


