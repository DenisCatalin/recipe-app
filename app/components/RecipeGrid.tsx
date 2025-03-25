"use client";

import { useCallback, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Recipe } from "../services/recipeService";
import RecipeCard from "./RecipeCard";
import SkeletonCard from "./SkeletonCard";
import { createSelector } from "reselect";
import { selectSortOption, selectRecentlyViewed } from "../store/selectors/preferences";
import { useRecipeState } from "../hooks/useRecipeState";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPage } from "../store/features/recipeSlice";

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
  width: 100%;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 380px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.75rem;
  }
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.primary : theme.cardBg)};
  color: ${({ theme, $active }) => ($active ? theme.background : theme.text)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    min-width: 36px;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme, $active }) => ($active ? theme.primary : theme.hover)};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
`;

interface RecipeGridProps {
  recipes: Recipe[];
  loading?: boolean;
  showAll?: boolean;
}

export default function RecipeGrid({ recipes, loading, showAll = false }: RecipeGridProps) {
  const { sortedRecipes, stats } = useRecipeState(recipes);
  const { currentPage, itemsPerPage } = useAppSelector(state => state.recipe);
  const dispatch = useAppDispatch();
  const gridRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(sortedRecipes.length / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const currentPageRecipes = showAll ? sortedRecipes : sortedRecipes.slice(start, end);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const getVisiblePageNumbers = useCallback((total: number, current: number) => {
    const maxButtons = window.innerWidth <= 768 ? 3 : 5;
    const half = Math.floor(maxButtons / 2);

    let start = Math.max(current - half, 0);
    let end = Math.min(start + maxButtons - 1, total - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(end - maxButtons + 1, 0);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, []);

  const renderPagination = () => {
    if (!totalPages || totalPages <= 1 || showAll) return null;

    const visiblePages = getVisiblePageNumbers(totalPages, currentPage);
    const showStartEllipsis = visiblePages[0] > 1;
    const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 2;

    return (
      <PaginationContainer>
        <PageButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
        >
          ←
        </PageButton>

        {!visiblePages.includes(0) && (
          <PageButton onClick={() => handlePageChange(0)} $active={currentPage === 0}>
            1
          </PageButton>
        )}

        {showStartEllipsis && <span>...</span>}

        {visiblePages.map(pageNum => (
          <PageButton
            key={pageNum}
            $active={currentPage === pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={loading}
          >
            {pageNum + 1}
          </PageButton>
        ))}

        {showEndEllipsis && <span>...</span>}

        {!visiblePages.includes(totalPages - 1) && (
          <PageButton
            onClick={() => handlePageChange(totalPages - 1)}
            $active={currentPage === totalPages - 1}
          >
            {totalPages}
          </PageButton>
        )}

        <PageButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
        >
          →
        </PageButton>
      </PaginationContainer>
    );
  };

  if (!loading && !stats.hasRecipes) {
    return (
      <EmptyState role="status" aria-label="No recipes to show yet">
        No recipes to show yet.
      </EmptyState>
    );
  }

  if (!loading && !stats.hasFilteredRecipes) {
    return (
      <EmptyState role="status" aria-label="No recently viewed recipes">
        No recently viewed recipes. Try searching for some recipes first!
      </EmptyState>
    );
  }

  return (
    <Container>
      <GridContainer ref={gridRef}>
        <AnimatePresence mode="popLayout">
          {currentPageRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.idMeal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <RecipeCard recipe={recipe} index={index} />
            </motion.div>
          ))}
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} index={index} />
            ))}
        </AnimatePresence>
      </GridContainer>
      {renderPagination()}
    </Container>
  );
}

export const selectHasRecentlyViewed = createSelector(
  [selectRecentlyViewed],
  recentlyViewed => recentlyViewed.length > 0
);

export const selectPreferencesState = createSelector([selectSortOption], sortOption => ({
  sortOption,
}));
