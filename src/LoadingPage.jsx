import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const HeroSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  padding: 0 5%;
  background: url("/assets/3.png") center/cover no-repeat; /* placeholder bg */
`;

const HeroContent = styled.div`
  max-width: 500px;
  z-index: 2;
`;

const SiteTitle = styled(motion.h2)`
  font-family: "Playwrite DE SAS", cursive;
  font-size: 3rem;
  color: #597c49ff;
  margin-bottom: 1rem;
`;

const SiteDescription = styled(motion.p)`
  font-family: "Gowun Dodum", cursive;
  font-size: 1.4rem;
  color: #222;
  margin-bottom: 2rem;
`;

const LoginButton = styled(motion.button)`
  background-color: #597c49ff;
  color: #fff;
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;

  &:hover {
    background-color: #669751ff;
    transform: scale(1.05);
  }
`;

const LoadingPage = () => {
  const navigate = useNavigate();

  const goToAuth = () => {
    navigate('/?mode=login');
    scroller.scrollTo("auth-section", {
      smooth: true,
      duration: 800,
    });
  };

  return (
    <HeroSection name="loading-section">
      <HeroContent>
        <SiteTitle
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Mind Ease
        </SiteTitle>
        <SiteDescription
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Bringing you calm, peace, and clarity for better mental well-being.
        </SiteDescription>
        <LoginButton onClick={goToAuth}>
          Get started
        </LoginButton>
      </HeroContent>
    </HeroSection>
  );
};

export default LoadingPage;
