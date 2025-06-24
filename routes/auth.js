import Users from "../model/Users.model.js";
import { Router } from "express";

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
    res.json({
      message: "login successfull",
      data: "12345",
    });
  }
  console.log(foundUser, "@foundUser");
  //   res.send(updatedUser);
});

// router.get("/login");

export default router;
