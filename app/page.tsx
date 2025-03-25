"use client";

import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import SearchBar from "./components/SearchBar";
import { useRecipeSearch } from "./hooks/useRecipeSearch";
import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "./components/LoadingSpinner";
import PreferencesControls from "./components/PreferencesControls";
import { useAppSelector } from "./store/hooks";
import ErrorState from "./components/ErrorState";

const RecipeGrid = dynamic(() => import("./components/RecipeGrid"), {
  loading: () => <LoadingSpinner />,
});

const SearchContainer = styled.div`
  margin-bottom: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export default function Home() {
  const { recipes, loading, error, search } = useRecipeSearch();
  const { showRecentOnly } = useAppSelector(state => state.preferences);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const searchInProgress = useRef(false);

  const handleSearch = useCallback(
    async (query: string) => {
      if (searchInProgress.current) return;
      if (query === lastSearchQuery) return;

      searchInProgress.current = true;
      setLastSearchQuery(query);
      await search(query);
      searchInProgress.current = false;
    },
    [search, lastSearchQuery]
  );

  useEffect(() => {
    if (!showRecentOnly && lastSearchQuery) {
      handleSearch(lastSearchQuery);
    }
  }, [showRecentOnly, handleSearch, lastSearchQuery]);

  return (
    <>
      <SearchContainer>
        <SearchBar onSearch={handleSearch} debounceTime={500} />
        <PreferencesControls onSearchSelect={handleSearch} />
      </SearchContainer>
      <Suspense
        fallback={
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        }
      >
        <AnimatePresence mode="wait">
          {error ? (
            <ErrorState
              title="Oops!"
              message={error}
              onRetry={() => (showRecentOnly ? null : handleSearch(lastSearchQuery))}
            />
          ) : (
            <RecipeGrid recipes={recipes} loading={loading} />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
