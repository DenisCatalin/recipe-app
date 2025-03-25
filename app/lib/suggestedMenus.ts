export interface Menu {
  name: string;
  recipes: {
    soup: string;
    main: string;
    dessert: string;
  };
}

export const suggestedMenus: Menu[] = [
  {
    name: "Classic Comfort",
    recipes: {
      soup: "52903",
      main: "52807",
      dessert: "52855",
    },
  },
  {
    name: "Mediterranean Delight",
    recipes: {
      soup: "52973",
      main: "53043",
      dessert: "52835",
    },
  },
];
