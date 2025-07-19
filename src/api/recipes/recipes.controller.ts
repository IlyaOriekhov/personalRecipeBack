import { Request, Response } from "express";
import { RequestWithUser } from "../../middleware/auth.middleware";
import * as RecipeService from "./recipes.service";

import prisma from "../../db";

import { GoogleGenerativeAI } from "@google/generative-ai";

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
    console.error(error);
  }
};

export const handleGetAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await RecipeService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
  }
};

export const handleGetMyRecipes = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const handleSearchRecipes = async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      title: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    include: {
      author: { select: { name: true } },
    },
  });
  res.json(recipes);
};

export const handleRateRecipe = async (req: RequestWithUser, res: Response) => {
  const recipeId = parseInt(req.params.id);
  const userId = req.user!.userId;
  const { value } = req.body;

  if (value < 1 || value > 5) {
    return res
      .status(400)
      .json({ message: "Rating value must be between 1 and 5" });
  }

  try {
    const newRating = await prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
      update: { value },
      create: { userId, recipeId, value },
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

export const handleGetAiTip = async (req: Request, res: Response) => {
  const recipeId = parseInt(req.params.id);

  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful cooking assistant. For the recipe "${
      recipe.title
    }", with ingredients "${recipe.ingredients.join(
      ", "
    )}", provide one short, helpful, and creative tip for cooking or serving it. Respond in Ukrainian.`;

    const result = await model.generateContent(prompt);
    const tip = result.response.text();

    res.json({ tip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get AI tip." });
  }
};
