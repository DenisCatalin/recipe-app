"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import { useId, useState, useCallback, useEffect } from "react";
import { usePreferences } from "../hooks/usePreferences";

const SearchContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  outline: none;
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

interface SearchBarProps {
  onSearch: (query: string) => void;
  debounceTime?: number;
}

export default function SearchBar({ onSearch, debounceTime = 300 }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const { addSearchTerm } = usePreferences();
  const inputId = useId();

  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim() === lastSearch) {
      return;
    }

    const timer = setTimeout(() => {
      onSearch(searchTerm.trim());
      addSearchTerm(searchTerm.trim());
      setLastSearch(searchTerm.trim());
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, onSearch, debounceTime, addSearchTerm, lastSearch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        onSearch(searchTerm.trim());
        addSearchTerm(searchTerm.trim());
        setSearchTerm("");
      }
    },
    [searchTerm, onSearch, addSearchTerm]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <SearchContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          id={inputId}
          type="search"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search recipes..."
          aria-label="Search recipes"
        />
      </SearchForm>
    </SearchContainer>
  );
}
