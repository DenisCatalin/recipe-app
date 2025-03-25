"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import RecipeGrid from "../components/RecipeGrid";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useEffect } from "react";
import { setPage } from "../store/features/recipeSlice";

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2rem;
`;

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: ${({ theme }) => theme.secondary};
  opacity: 0.8;
`;

export default function FavoritesPage() {
  const favorites = useAppSelector(state => state.favorites.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPage(0));
  }, [dispatch]);

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>My Favorite Recipes</Title>

      {favorites.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>No Favorites Yet</EmptyStateTitle>
          <EmptyStateText>Start adding recipes to your favorites to see them here!</EmptyStateText>
        </EmptyState>
      ) : (
        <RecipeGrid recipes={favorites} loading={false} showAll={true} />
      )}
    </Container>
  );
}
