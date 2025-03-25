"use client";

import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const ErrorContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  height: 400px;
`;

const ErrorTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2rem;
  max-width: 600px;
`;

const RetryButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.secondary};
  }
`;

const NotFound = () => {
  const router = useRouter();
  return (
    <ErrorContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ErrorTitle>Oops! Something went wrong</ErrorTitle>
      <ErrorMessage>The page you are looking for does not exist.</ErrorMessage>
      <RetryButton
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to Home
      </RetryButton>
    </ErrorContainer>
  );
};

export default NotFound;
