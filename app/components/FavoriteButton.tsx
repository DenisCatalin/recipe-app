"use client";

import { memo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Recipe } from "../services/recipeService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addFavorite, removeFavorite } from "../store/features/favoritesSlice";

const Button = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.card}CC;
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.card};
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}40;
  }

  &:focus:not(:focus-visible) {
    box-shadow: none;
  }
`;

const HeartIcon = memo(({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
));

HeartIcon.displayName = "HeartIcon";

interface FavoriteButtonProps {
  recipe: Recipe;
}

export default function FavoriteButton({ recipe }: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(state =>
    state.favorites.items.some(fav => fav.idMeal === recipe.idMeal)
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isFavorite) {
      dispatch(removeFavorite(recipe.idMeal));
    } else {
      dispatch(addFavorite(recipe));
    }
  };

  return (
    <Button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      aria-label={
        isFavorite
          ? `Remove ${recipe.strMeal} from favorites`
          : `Add ${recipe.strMeal} to favorites`
      }
      aria-pressed={isFavorite}
    >
      <HeartIcon filled={isFavorite} />
    </Button>
  );
}
