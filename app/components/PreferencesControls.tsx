"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  SortOption,
  setSortOption,
  clearSearchHistory,
  toggleRecentOnly,
} from "../store/features/preferencesSlice";
import { suggestedMenus } from "../lib/suggestedMenus";
import { setAllRecipes } from "../store/features/recipeSlice";
import { getRecipeById } from "../services/recipeService";

const Container = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  margin: 1rem;
  box-shadow: ${({ theme }) => theme.cardShadow};
  flex-wrap: wrap;

  @media (max-width: 950px) {
    padding: 1rem;
    gap: 0.5rem;
    margin: 0.5rem
    justify-content: space-between;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;

  @media (max-width: 768px) {
    padding: 0.5rem;
    flex: 1 1 calc(50% - 0.5rem);
    min-width: 140px;
  }
`;

const Label = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Select = styled.select`
  padding: 0.5rem 2rem 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 140px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    min-width: 100px;
    font-size: 0.8rem;
    padding: 0.4rem 1.8rem 0.4rem 0.8rem;
  }

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.hover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}33`};
  }

  option {
    background: ${({ theme }) => theme.cardBg};
    color: ${({ theme }) => theme.text};
    padding: 12px 16px;
    font-size: 0.9rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};

    &:first-of-type {
      border-radius: 8px 8px 0 0;
    }

    &:last-of-type {
      border-radius: 0 0 8px 8px;
      border-bottom: none;
    }

    &:hover {
      background: ${({ theme }) => theme.hover};
    }

    &:checked {
      background: ${({ theme }) => theme.primary + "15"};
      color: ${({ theme }) => theme.primary};
      font-weight: 500;
    }
  }
`;

const SearchHistoryContainer = styled.div`
  margin-left: auto;
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-left: 0;
    flex: 1 1 100%;
    order: -1;
    margin-bottom: 0.5rem;
  }
`;

const SearchHistoryButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const SearchHistoryPopup = styled.div<{ $isVisible: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 200px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  z-index: 10;
`;

const SearchHistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SearchHistoryItem = styled.li`
  padding: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};

  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const ClearHistoryButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.error};
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.5rem;
  width: 100%;
  text-align: center;
  margin-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};

  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button<{ $isActive?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid ${({ theme, $isActive }) => ($isActive ? theme.primary : theme.border)};
  background: ${({ theme, $isActive }) => ($isActive ? theme.primary : theme.cardBg)};
  color: ${({ theme, $isActive }) => ($isActive ? theme.background : theme.text)};
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    flex: 1 1 calc(50% - 0.5rem);
    justify-content: center;
  }

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.primary : theme.hover)};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}33`};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

interface Props {
  onSearchSelect: (query: string) => void;
}

export default function PreferencesControls({ onSearchSelect }: Props) {
  const dispatch = useAppDispatch();
  const { sortOption, searchHistory, showRecentOnly } = useAppSelector(state => state.preferences);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearchHistoryClick = useCallback(
    (term: string) => {
      if (onSearchSelect) {
        onSearchSelect(term);
      }
      setIsHistoryVisible(false);
    },
    [onSearchSelect]
  );

  const handleMenuChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const menuName = e.target.value;
      if (menuName === selectedMenu) return;

      setSelectedMenu(menuName);

      if (!menuName) {
        dispatch(setAllRecipes([]));
        return;
      }

      const menu = suggestedMenus.find(m => m.name === menuName);
      if (!menu) return;

      try {
        const recipes = await Promise.all([
          getRecipeById(menu.recipes.soup),
          getRecipeById(menu.recipes.main),
          getRecipeById(menu.recipes.dessert),
        ]);

        dispatch(setAllRecipes(recipes));
      } catch (error) {
        console.error("Error loading menu recipes:", error);
      }
    },
    [selectedMenu, dispatch]
  );

  return (
    <Container>
      <ControlGroup>
        <Label htmlFor="sortOption">Sort by:</Label>
        <Select
          id="sortOption"
          value={sortOption}
          onChange={e => dispatch(setSortOption(e.target.value as SortOption))}
        >
          <option value="alphabetical">A-Z</option>
          <option value="cuisine">Cuisine</option>
        </Select>
      </ControlGroup>

      <Button onClick={() => dispatch(toggleRecentOnly())} $isActive={showRecentOnly}>
        <ClockIcon /> Recently Viewed
      </Button>

      <SearchHistoryContainer>
        <Select value={selectedMenu} onChange={handleMenuChange}>
          <option value="">Select menu</option>
          {suggestedMenus.map(menu => (
            <option key={menu.name} value={menu.name}>
              {menu.name}
            </option>
          ))}
        </Select>
        <SearchHistoryButton
          onClick={() => setIsHistoryVisible(!isHistoryVisible)}
          aria-label="Show search history"
        >
          <HistoryIcon /> Recent Searches
        </SearchHistoryButton>

        <SearchHistoryPopup $isVisible={isHistoryVisible}>
          <SearchHistoryList>
            {!isClient ? null : searchHistory.length === 0 ? (
              <SearchHistoryItem>No recent searches</SearchHistoryItem>
            ) : (
              searchHistory.map(term => (
                <SearchHistoryItem key={term} onClick={() => handleSearchHistoryClick(term)}>
                  {term}
                </SearchHistoryItem>
              ))
            )}
          </SearchHistoryList>
          {searchHistory.length > 0 && isClient && (
            <ClearHistoryButton onClick={() => dispatch(clearSearchHistory())}>
              Clear History
            </ClearHistoryButton>
          )}
        </SearchHistoryPopup>
      </SearchHistoryContainer>
    </Container>
  );
}

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 8v4l3 3" />
    <path d="M3.05 11a9 9 0 1 1 .5 4" />
  </svg>
);
