"use client";

import styled from "styled-components";
import Navigation from "./Navigation";
import ThemeToggle from "./ThemeToggle";

const Header = styled.header`
  text-align: center;
  position: relative;
  padding: 1rem;
`;

const Title = styled.h1.withConfig({
  componentId: "RecipeFinderTitle",
  displayName: "Title",
})`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.text};
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 380px) {
    font-size: 1.5rem;
  }
`;

const MainContainer = styled.main.withConfig({
  componentId: "MainContainer",
  displayName: "MainContainer",
})`
  max-width: 80%;
  min-height: 35vh;
  margin: 0 auto;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    max-width: 95%;
  }
`;

const ThemeToggleContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

export default function StyledLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header>
        <ThemeToggleContainer>
          <ThemeToggle />
        </ThemeToggleContainer>
        <Title>Recipe Finder</Title>
        <Navigation />
      </Header>
      <MainContainer>{children}</MainContainer>
    </>
  );
}
