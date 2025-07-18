import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
  handleCreateRecipe,
  handleDeleteRecipe,
  handleGetAllRecipes,
  handleGetRecipeById,
  handleUpdateRecipe,
} from "./recipes.controller";

const router = Router();

router.get("/", handleGetAllRecipes);
router.get("/:id", handleGetRecipeById);

router.post("/", authMiddleware, handleCreateRecipe);

router.put("/:id", authMiddleware, handleUpdateRecipe);

router.delete("/:id", authMiddleware, handleDeleteRecipe);

export default router;
