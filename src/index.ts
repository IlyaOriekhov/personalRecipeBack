import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./api/auth/auth.routes";
import recipesRouter from "./api/recipes/recipes.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello FlavorAI backend!");
});

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
