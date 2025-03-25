"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Recipe, getRecipeById } from "@/app/services/recipeService";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addFavorite, removeFavorite } from "@/app/store/features/favoritesSlice";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.text};
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 2rem;
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.primary};
  border-radius: 20px;
  font-size: 1rem;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(motion.div)`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const IngredientItem = styled(motion.li)`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};

  &:last-child {
    border-bottom: none;
  }

  &:before {
    content: "•";
    color: ${({ theme }) => theme.primary};
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const Instructions = styled.div`
  color: ${({ theme }) => theme.text};
  line-height: 1.8;
  font-size: 1.1rem;

  p {
    margin-bottom: 1rem;
  }
`;

const FavoriteButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.cardBg};
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 50px;
  color: ${({ theme }) => theme.accent};
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
`;

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  const isFavorite = recipe ? favorites.some(item => item.idMeal === recipe.idMeal) : false;
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);
        addRecentlyViewed(id);
      } catch (error) {
        console.error("Error loading recipe:", error);
      }
    };

    loadRecipe();
  }, [id]);

  const handleFavoriteClick = () => {
    if (!recipe) return;

    if (isFavorite) {
      dispatch(removeFavorite(recipe.idMeal));
    } else {
      dispatch(addFavorite(recipe));
    }
  };

  if (!recipe) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  const ingredients = Object.entries(recipe)
    .filter(([key, value]) => key.startsWith("strIngredient") && value)
    .map((_, index) => ({
      ingredient: recipe[`strIngredient${index + 1}`],
      measure: recipe[`strMeasure${index + 1}`],
    }))
    .filter(({ ingredient, measure }) => ingredient && measure);

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <Title>{recipe.strMeal}</Title>
        <CategoryBadge>{recipe.strCategory}</CategoryBadge>
        <FavoriteButton
          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </FavoriteButton>
      </Header>

      <ImageContainer
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      </ImageContainer>

      <ContentGrid>
        <Section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionTitle>Ingredients</SectionTitle>
          <IngredientList>
            {ingredients.map((item, index) => (
              <IngredientItem
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.ingredient} - {item.measure}
              </IngredientItem>
            ))}
          </IngredientList>
        </Section>

        <Section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SectionTitle>Instructions</SectionTitle>
          <Instructions>
            {recipe.strInstructions.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Instructions>
        </Section>
      </ContentGrid>
    </Container>
  );
}
