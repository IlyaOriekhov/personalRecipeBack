import prisma from "../../db";

interface RecipeData {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
}

export const createRecipe = (recipeData: RecipeData, authorId: number) => {
  return prisma.recipe.create({
    data: {
      ...recipeData,
      authorId: authorId, // прив'язав рецепт до айді
    },
  });
};

export const getAllRecipes = () => {
  return prisma.recipe.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getRecipeById = (id: number) => {
  return prisma.recipe.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      ratings: true,
    },
  });
};

export const updateRecipe = (id: number, recipeData: RecipeData) => {
  return prisma.recipe.update({
    where: {
      id: id,
    },
    data: recipeData,
  });
};

export const deleteRecipe = (id: number) => {
  return prisma.recipe.delete({
    where: {
      id: id,
    },
  });
};
