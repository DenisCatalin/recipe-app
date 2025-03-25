"use client";

import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.cardShadow};
  position: relative;
`;

const ImageSkeleton = styled.div`
  width: 100%;
  padding-top: 75%;
  background: ${({ theme }) => theme.border};
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.cardHoverBg}40,
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const TitleSkeleton = styled.div`
  width: 80%;
  height: 24px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.cardHoverBg}40,
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const CategorySkeleton = styled.div`
  width: 40%;
  height: 20px;
  background: ${({ theme }) => theme.border};
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.cardHoverBg}40,
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const DescriptionSkeleton = styled.div`
  width: 100%;
  height: 32px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.cardHoverBg}40,
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

interface SkeletonCardProps {
  index: number;
}

export default function SkeletonCard({ index }: SkeletonCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <Card variants={cardVariants} initial="hidden" animate="visible">
      <ImageSkeleton />
      <Content>
        <TitleSkeleton />
        <CategorySkeleton />
        <DescriptionSkeleton />
      </Content>
    </Card>
  );
}
