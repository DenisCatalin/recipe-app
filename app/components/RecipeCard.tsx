"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Recipe } from "../services/recipeService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addRecentlyViewed } from "../store/features/preferencesSlice";
import { memo, useCallback } from "react";
import FavoriteButton from "./FavoriteButton";

const CardButton = styled(motion.div)`
  text-decoration: none;
  color: inherit;
  outline: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 4px;
    border-radius: 16px;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.cardShadow};
  height: 420px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  ${CardButton}:focus-visible & {
    transform: translateY(-4px);
  }

  ${CardButton}:hover & {
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const Tags = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3h18v18H3V3z" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const AreaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

function RecipeCard({ recipe, index }: RecipeCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(addRecentlyViewed(recipe.idMeal));
    router.push(`/recipe/${recipe.idMeal}`);
  }, [recipe.idMeal, recipe.strMeal, dispatch, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <CardButton
      onClick={handleClick}
      aria-labelledby={`recipe-${recipe.idMeal}-title`}
      role="button"
      tabIndex={0}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onKeyDown={handleKeyDown}
    >
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <ImageContainer>
          <StyledImage
            src={recipe.strMealThumb}
            alt={`Photo of ${recipe.strMeal}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 4}
            fill
          />
          <FavoriteButton recipe={recipe} />
        </ImageContainer>
        <Content>
          <Title id={`recipe-${recipe.idMeal}-title`}>{recipe.strMeal}</Title>
          <Description>
            {recipe.strInstructions?.length > 120
              ? recipe.strInstructions.substring(0, 120).trim() + "..."
              : recipe.strInstructions}
          </Description>
          <Tags role="list">
            <span role="listitem">
              <CategoryIcon aria-hidden="true" />
              <span>{recipe.strCategory}</span>
            </span>
            <span role="listitem">
              <AreaIcon aria-hidden="true" />
              <span>{recipe.strArea}</span>
            </span>
          </Tags>
        </Content>
      </Card>
    </CardButton>
  );
}

RecipeCard.displayName = "RecipeCard";

export default memo(RecipeCard, (prevProps, nextProps) => {
  return prevProps.recipe.idMeal === nextProps.recipe.idMeal && prevProps.index === nextProps.index;
});
