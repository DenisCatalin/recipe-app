"use client";

import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Icon = styled(motion.div)`
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 1.5rem;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 1.5rem;
  max-width: 500px;
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

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Icon initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </Icon>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {onRetry && (
        <RetryButton onClick={onRetry} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Try Again
        </RetryButton>
      )}
    </Container>
  );
}
