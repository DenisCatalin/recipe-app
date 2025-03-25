"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "../store/hooks";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
`;

interface NavLinkProps {
  $active?: boolean;
}

const NavLink = styled(motion(Link))<NavLinkProps>`
  padding: 0.75rem 1.5rem;
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.text)};
  text-decoration: none;
  border-radius: 25px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 30%;
      height: 3px;
      background: ${theme.primary};
      border-radius: 3px;
    }
  `}
`;

const Badge = styled(motion.span)`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

export default function Navigation() {
  const pathname = usePathname();
  const favoritesCount = useAppSelector(state => state.favorites.items.length);

  return (
    <Nav>
      <NavLink
        href="/"
        $active={pathname === "/"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Home
      </NavLink>
      <NavLink
        href="/favorites"
        $active={pathname === "/favorites"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Favorites
        <AnimatePresence mode="wait">
          {favoritesCount > 0 && (
            <Badge
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {favoritesCount}
            </Badge>
          )}
        </AnimatePresence>
      </NavLink>
    </Nav>
  );
}
