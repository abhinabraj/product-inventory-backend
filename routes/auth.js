import Users from "../model/Users.model.js";
import { Router } from "express";
import { createToken } from "../utils/create-token.js";
import bcrypt from "bcrypt";

const router = Router();

const user = {
  firstName: "Abhinab",
  lastName: "Basu",
  email: "abhinab@gmail.com",
  password: "admin"
}

const {password, ...userData} = user;

userData = {
  firstName: "Abhinab",
  lastName: "Basu",
  email: "abhinab@gmail.com",
}

router.post("/signup", async (req, res) => {
  const { password, ...userData } = req.body;
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = new Users({ ...userData, password: hashedPassword });
  await newUser.save();
  return res.send(newUser);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await Users.findOne({ email: email });
  if (!foundUser) {
    return res.send("user or password is incorrect");
  }
  console.log("after error");
  const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
  if (isPasswordMatch) {
    const accessToken = createToken({
      email: foundUser.email,
      _id: foundUser._id,
    });
    return res.status(200).json({
      message: "login successfull",
      accessToken,
    });
  } else {
   return res.status(401).json({
      message: "email or password is incorrect",
    });
  }
});

// router.get("/login");

export default router;
