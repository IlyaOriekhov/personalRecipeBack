import { Request, Response } from "express";
import { RequestWithUser } from "../../middleware/auth.middleware";
import * as RecipeService from "./recipes.service";

import prisma from "../../db";

export const handleCreateRecipe = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const recipeData = req.body;
    const authorId = req.user!.userId;

    const newRecipe = await RecipeService.createRecipe(recipeData, authorId);

    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await RecipeService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetRecipeById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const recipe = await RecipeService.getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUpdateRecipe = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user!.userId;
    const recipeData = req.body;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the author of this recipe" });
    }

    const updatedRecipe = await RecipeService.updateRecipe(
      recipeId,
      recipeData
    );
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteRecipe = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user!.userId;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the author of this recipe" });
    }

    await RecipeService.deleteRecipe(recipeId);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
