import Users from "../model/Users.model.js";
import { Router } from "express";
import { createToken } from "../utils/create-token.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const newUser = new Users(req.body);
  await newUser.save();
  res.send(newUser);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await Users.findOne({ email: email });
  if (!foundUser) {
    res.send("user or password is incorrect");
  }
  if (foundUser.password === password) {
    const accessToken = createToken({
      email: foundUser.email,
      _id: foundUser._id,
    });
    res.status(200).json({
      message: "login successfull",
      accessToken,
    });
  } else {
    res.status(401).json({
      message: "email or password is incorrect",
    });
  }
  console.log(foundUser, "@foundUser");
  //   res.send(updatedUser);
});

// router.get("/login");

export default router;
