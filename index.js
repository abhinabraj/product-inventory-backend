import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import { users } from "./mockData.js";
import "dotenv/config";

import multer from "multer";

import categoryRouter from "./routes/category.js";
import authRouter from "./routes/auth.js";
import Users from "./model/Users.model.js";
import Product from "./model/Product.model.js";
import Category from "./model/Category.model.js";
import { verifyAuth } from "./middleware/verify-auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product-images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// app.use("/category", categoryRouter);

app.use("/auth", authRouter);

app.get("/category", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

app.post("/category", async (req, res) => {
  const category = req.body;
  const newCategory = new Category(category);
  await newCategory.save();
  res.send(newCategory);
});

app.get("/users", async function (req, res) {
  const users = await Users.find(req.query);
  res.send(users);
});

app.post("/users", async (req, res) => {
  const user = req.body;
  console.log(user);
  const newUser = new Users(user);
  await newUser.save();
  res.send(newUser);
});

app.put("/users/:id", async (req, res) => {
  const user = req.body;
  const id = req.params.id;
  const updatedUser = await Users.findByIdAndUpdate({ _id: id }, user, {
    new: true,
  });
  res.send(updatedUser);
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const deletedUser = await Users.findByIdAndDelete({ _id: id });
  res.send(deletedUser);
});

app.delete("/user-delete/:id", async (req, res) => {
  console.log(req.params.id);
});

app.post("/product", verifyAuth, async (req, res) => {
  const product = req.body;
  const newProduct = new Product(product);
  await newProduct.save();
  res.send(newProduct);
});

app.get("/product", verifyAuth, async (req, res) => {
  console.log(req.user, "@req.user");
  const products = await Product.find().populate("category");
  res.send(products);
});

app.put("/product/:id", async (req, res) => {
  console.log(req, "@request");
  const { id } = req.params;
  /**
   * {
   *  name: "new name",
   * description: "new description",
   * price: 100,
   * category: asdfasdf,
   * }
   */
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(updatedProduct);
});

app.post("/product-image", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: `http://localhost:8000/product-images/${req.file.filename}`,
  });
});

app.listen(8000, async () => {
  console.log("Server is running on port 8000");
  await mongoose.connect(process.env.DB_URL);
  console.log("Connected to MongoDB");
});
