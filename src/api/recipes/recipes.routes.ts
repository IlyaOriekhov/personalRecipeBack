import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
  handleCreateRecipe,
  handleDeleteRecipe,
  handleGetAiTip,
  handleGetAllRecipes,
  handleGetMyRecipes,
  handleGetRecipeById,
  handleRateRecipe,
  handleSearchRecipes,
  handleUpdateRecipe,
} from "./recipes.controller";

const router = Router();

router.get("/search", handleSearchRecipes);
router.get("/mine", authMiddleware, handleGetMyRecipes);

router.get("/", handleGetAllRecipes);
router.get("/:id", handleGetRecipeById);

router.post("/", authMiddleware, handleCreateRecipe);

router.put("/:id", authMiddleware, handleUpdateRecipe);

router.delete("/:id", authMiddleware, handleDeleteRecipe);

router.post("/:id/rate", authMiddleware, handleRateRecipe);

router.post("/:id/ai-tip", authMiddleware, handleGetAiTip);

export default router;
