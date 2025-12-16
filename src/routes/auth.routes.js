import express from "express";

import passport from "passport";

import bcrypt from "bcrypt";

import User from "../models/users.models.js";

import "../auth/googleStrategy.js"

const router = express.Router();

 
/*
router.post("/login",

  passport.authenticate("local", {

    successRedirect: "/dashboard",

    failureRedirect: "/login?error=1"

  })

);*/

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


router.post("/signup", async (req, res) => {

  const { email, password, name } = req.body;

  // si le password n’est pas fourni, bcrypt plante.
  // pensez à tester tous les champs !
  if (!password || password.length < 8) {

    return res.status(400).json({ error: "Password must be at least 8 characters long" });

  }

 

  const hash = await bcrypt.hash(password, 10);

  

  // création de l’utilisateur dans un try catch au cas où la requête plante

   try {

    const user = await User.create({

      email,

      password: hash,

      name

    });

    return res.json({ message: "User created", user: user.toJSON() });

  } catch (error) {

    return res.status(500).json({ error: error.message });

  }

});


router.get("/google",

  passport.authenticate("google", { scope: ["profile", "email"] })

);
router.get("/google/callback", passport.authenticate("google", {

    failureRedirect: "/login",

    successRedirect: "/dashboard"

  })

);

export default router;