import express from "express";

import passport from "passport";

import bcrypt from "bcrypt";

import User from "../models/users.models.js";

import "../auth/googleStrategy.js"
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

 
/*
router.post("/login",

  passport.authenticate("local", {

    successRedirect: "/dashboard",

    failureRedirect: "/login?error=1"

  })

);*/
/*
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Logged in", user });
    });
  })(req, res, next);
});
*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: "Email and password are required" });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      {user:{id:user._id, email:user.email, firstname:user.firstname, lastname:user.lastname}}, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      {user:{id:user._id, email:user.email}}, 
      process.env.REFRESH_TOKEN, 
      { expiresIn: "7d" }
    );
    await User.findOneAndUpdate({email:email}, {refreshToken: refreshToken}, {new:true}).then(updatedUser => {
      console.log("Refresh token updated for user:", updatedUser.email);
    });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 jours
    return res.json({ message: "Logged in", token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.status(204).json({ message: "No content" });
  const refreshToken = cookies.refreshToken;
  try {
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", { httpOnly: true, secure: true });
      return res.status(204).json({ message: "No content" });
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: null}, { new: true})
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.status(204).json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  // si le password n’est pas fourni, bcrypt plante.
  // pensez à tester tous les champs !
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }
  const hash = await bcrypt.hash(password, 10);
  // création de l’utilisateur dans un try catch au cas où la requête plante
   try {
    if(await User.findOne({ email })) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({
      email,
      password: hash,
      firstname,
      lastname,
      role: "user"
    });

    return res.json({ message: "User created", user: user.toJSON() });

  } catch (error) {

    return res.status(500).json({ error: error.message });

  }

});

/*
router.get("/google",

  passport.authenticate("google", { scope: ["profile", "email"] })

);
router.get("/google/callback", passport.authenticate("google", {

    failureRedirect: "/login",

    successRedirect: "/dashboard"

  })

);*/

export default router;