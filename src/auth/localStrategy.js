import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";

import User from "../models/users.models.js";

 

passport.use(

  new LocalStrategy(

    {

      usernameField: "email",     // req.body.email

      passwordField: "password",  // req.body.password

    },

    async (email, password, done) => {

      try {

        const user = await User.findOne({ email });

 

        if (!user) {

          return done(null, false, { message: "Email inconnu." });

        }

 

        const isValid = await user.checkPassword(password);

        if (!isValid) {

          return done(null, false, { message: "Mot de passe incorrect." });

        }

 

        return done(null, user);

      } catch (err) {

        return done(err);

      }

    }

  )

);