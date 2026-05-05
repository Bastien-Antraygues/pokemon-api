import express from "express";
import session from "express-session";

import authRoutes from "./src/routes/auth/auth.routes.js"
import typesRoutes from "./src/routes/types/types.routes.js"
import pokemonRoutes from "./src/routes/pokemons/pokemons.routes.js"
import privatesRoutes from "./src/routes/privates/privates.routes.js"
import passport from "passport";
import verifyJWT from "./src/middleware/verifyJWT.js";
import cookieParser from "cookie-parser";

const app = express();
/*
const RedisStore = RedisStoreFactory(session);
const redisClient = createClient({

  url: "redis://localhost:6379"

});*//*
app.use(session({
    //store: new RedisStore({client:redisClient}),
    secret:"supersecret123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 15 } // 15 min
}))

app.use(passport.initialize());
app.use(passport.session());

export function isAuthenticated(req, res, next) {

  if (req.session.user) return next();

  return res.status(401).json({ error: "Unauthenticated" });

}*/
app.use(express.json());
app.use(cookieParser());

app.use("/auth",authRoutes);
app.use("/types",typesRoutes);
app.use("/pokemon",pokemonRoutes);
app.use(verifyJWT);
app.use("/",privatesRoutes);


export default app;