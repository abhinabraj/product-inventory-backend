import { Router } from "express";
import Category from "../model/Category.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.post("/", async (req, res) => {
  const category = req.body;
  const newCategory = new Category(category);
  await newCategory.save();
  res.send(newCategory);
});

export default router;
