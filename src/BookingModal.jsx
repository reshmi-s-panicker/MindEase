import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaTimes, FaCalendarAlt, FaUser, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCounselorsByInstitution, createBooking } from "./api";

// Styled Components
const PageOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const PageContainer = styled(motion.div)`
  backdrop-filter: blur(20px);
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #597c49ff 0%, #669751ff 100%);
  color: white;
  padding: 25px 30px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h2`
  margin: 0;
  font-family: "Gowun Dodum", cursive;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const PageContent = styled.div`
  padding: 30px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: #597c49ff;
  font-family: "Gowun Dodum", cursive;
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid #597c49ff;
  padding-bottom: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #597c49ff;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 15px;
  border-radius: 12px;
  border: 2px solid rgba(89, 124, 73, 0.3);
  outline: none;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  color: #1e1e1eff;
  transition: all 0.3s ease;
  &::placeholder {
    color: rgba(34, 34, 34, 0.5);
  }
  &:focus {
    border-color: #597c49ff;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(89, 124, 73, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border-radius: 12px;
  border: 2px solid rgba(89, 124, 73, 0.3);
  background: rgba(255, 255, 255, 0.8);
  color: #1e1e1eff;
  outline: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:focus {
    border-color: #597c49ff;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(89, 124, 73, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border-radius: 12px;
  border: 2px solid rgba(89, 124, 73, 0.3);
  outline: none;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  color: #1e1e1eff;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.3s ease;
  &::placeholder {
    color: rgba(34, 34, 34, 0.5);
  }
  &:focus {
    border-color: #597c49ff;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(89, 124, 73, 0.1);
  }
`;

const SurveyGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const QuestionContainer = styled.div`
  background: rgba(89, 124, 73, 0.08);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(89, 124, 73, 0.2);
`;

const QuestionText = styled.p`
  color: #597c49ff;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 15px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #1e1e1eff;
  font-size: 14px;
  transition: all 0.2s ease;
  &:hover {
    color: #597c49ff;
  }
`;

const RadioInput = styled.input`
  accent-color: #597c49ff;
  transform: scale(1.2);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: flex-end;
`;

const Button = styled(motion.button)`
  padding: 12px 25px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background: #597c49ff;
  color: white;
  &:hover {
    background: #669751ff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(89, 124, 73, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #597c49ff;
  border: 2px solid #597c49ff;
  &:hover {
    background: #597c49ff;
    color: white;
  }
`;

// Booking Page Component
const BookingPage = () => {
  const navigate = useNavigate();
  const [counselorName, setCounselorName] = useState("Dr. Sarah Johnson");
  const [counselors, setCounselors] = useState([]);

  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    sessionType: '',
    urgencyLevel: '',
    reason: '',
    anxiety: '',
    depression: '',
    academicStress: '',
    burnout: '',
    sleepDisorders: '',
    socialIsolation: '',
    additionalConcerns: '',
    selectedCounselor: ''
  });

  React.useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const raw = localStorage.getItem("authUser");
        if (!raw) return;
        const user = JSON.parse(raw);
        const inst = user?.institution;
        if (!inst) return;
        
        const res = await getCounselorsByInstitution(inst);
        if (res?.counselors?.length > 0) {
          setCounselors(res.counselors);
          setCounselorName(res.counselors[0].name); // Default to first counselor
        }
      } catch (err) {
        console.error('Failed to fetch counselors:', err);
      }
    };
    
    fetchCounselors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get current user info
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        alert('Please login to book a session');
        return;
      }
      const user = JSON.parse(raw);
      
      if (!formData.selectedCounselor) {
        alert('Please select a counselor');
        return;
      }

      // Prepare booking data
      const bookingData = {
        student_id: user.id,
        counselor_id: parseInt(formData.selectedCounselor),
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        session_type: formData.sessionType,
        reason: formData.reason,
        urgency_level: formData.urgencyLevel,
        anxiety_level: formData.anxiety,
        depression_level: formData.depression,
        academic_stress: formData.academicStress,
        burnout_level: formData.burnout,
        sleep_quality: formData.sleepDisorders,
        social_isolation: formData.socialIsolation,
        additional_concerns: formData.additionalConcerns
      };

      // Submit booking
      const response = await createBooking(bookingData);
      
      if (response.message) {
        alert('Booking request submitted successfully! You will receive a confirmation email shortly.');
        navigate(-1);
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const surveyQuestions = [
    { key: 'anxiety', question: 'How would you rate your current anxiety levels?', options: [
        { value: 'none', label: 'None' }, { value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }
      ] },
    { key: 'depression', question: 'Have you been experiencing symptoms of depression?', options: [
        { value: 'none', label: 'Not at all' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'constantly', label: 'Almost constantly' }
      ] },
    { key: 'academicStress', question: 'How stressed do you feel about your academic performance?', options: [
        { value: 'low', label: 'Low stress' }, { value: 'moderate', label: 'Moderate stress' }, { value: 'high', label: 'High stress' }, { value: 'overwhelming', label: 'Overwhelming' }
      ] },
    { key: 'burnout', question: 'Do you feel burned out or emotionally exhausted?', options: [
        { value: 'never', label: 'Never' }, { value: 'sometimes', label: 'Sometimes' }, { value: 'often', label: 'Often' }, { value: 'always', label: 'Always' }
      ] },
    { key: 'sleepDisorders', question: 'How would you describe your sleep quality?', options: [
        { value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' }, { value: 'poor', label: 'Poor' }, { value: 'very-poor', label: 'Very Poor' }
      ] },
    { key: 'socialIsolation', question: 'Do you feel socially isolated or lonely?', options: [
        { value: 'never', label: 'Never' }, { value: 'rarely', label: 'Rarely' }, { value: 'sometimes', label: 'Sometimes' }, { value: 'frequently', label: 'Frequently' }
      ] },
  ];

  return (
    <PageOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(-1)}
    >
      <PageContainer onClick={(e) => e.stopPropagation()}>
        <PageHeader>
          <PageTitle>
            <FaCalendarAlt /> Book Session with {counselorName}
          </PageTitle>
          <CloseButton onClick={() => navigate(-1)}>
            <FaTimes />
          </CloseButton>
        </PageHeader>

        <PageContent>
          <form onSubmit={handleSubmit}>
            {/* Booking Details */}
            <Section>
              <SectionTitle><FaUser /> Session Details</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </Select>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="sessionType">Session Type</Label>
                  <Select
                    id="sessionType"
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="individual">Individual Session (50 min)</option>
                    <option value="consultation">Quick Consultation (25 min)</option>
                    <option value="crisis">Crisis Intervention</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="selectedCounselor">Select Counselor</Label>
                  <Select
                    id="selectedCounselor"
                    name="selectedCounselor"
                    value={formData.selectedCounselor}
                    onChange={(e) => {
                      const counselorId = e.target.value;
                      const counselor = counselors.find(c => c.id.toString() === counselorId);
                      if (counselor) {
                        setCounselorName(counselor.name);
                        setFormData(prev => ({ ...prev, selectedCounselor: counselorId }));
                      }
                    }}
                    required
                  >
                    <option value="">Select counselor</option>
                    {counselors.map(counselor => (
                      <option key={counselor.id} value={counselor.id}>
                        {counselor.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label htmlFor="reason">Brief reason for booking</Label>
                <TextArea
                  id="reason"
                  name="reason"
                  placeholder="Please provide a brief description..."
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Section>

            {/* Mental Health Survey */}
            <Section>
              <SectionTitle><FaHeart /> Mental Health Assessment</SectionTitle>
              <p style={{ color: '#616161ff', marginBottom: '20px', fontSize: '14px' }}>
                This brief assessment helps your counselor better understand your current mental health state and prepare for your session.
              </p>
              <SurveyGrid>
                {surveyQuestions.map(q => (
                  <QuestionContainer key={q.key}>
                    <QuestionText>{q.question}</QuestionText>
                    <RadioGroup>
                      {q.options.map(opt => (
                        <RadioOption key={opt.value}>
                          <RadioInput
                            type="radio"
                            name={q.key}
                            value={opt.value}
                            checked={formData[q.key] === opt.value}
                            onChange={handleInputChange}
                            required
                          />
                          {opt.label}
                        </RadioOption>
                      ))}
                    </RadioGroup>
                  </QuestionContainer>
                ))}
                <QuestionContainer>
                  <QuestionText>Any additional concerns or topics you'd like to discuss?</QuestionText>
                  <TextArea
                    name="additionalConcerns"
                    placeholder="Feel free to share anything else..."
                    value={formData.additionalConcerns}
                    onChange={handleInputChange}
                    style={{ marginTop: '10px' }}
                  />
                </QuestionContainer>
              </SurveyGrid>
            </Section>

            <ButtonContainer>
              <SecondaryButton type="button" onClick={() => navigate(-1)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit">
                Book Session
              </PrimaryButton>
            </ButtonContainer>
          </form>
        </PageContent>
      </PageContainer>
    </PageOverlay>
  );
};

export default BookingPage;
