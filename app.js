import express from "express";
import session from "express-session";

import authRoutes from "./src/routes/auth.routes.js"
import typesRoutes from "./src/routes/types/types.routes.js"
import pokemonRoutes from "./src/routes/pokemons/pokemons.routes.js"
import passport from "passport";

const app = express();
/*
const RedisStore = RedisStoreFactory(session);
const redisClient = createClient({

  url: "redis://localhost:6379"

});*/
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

}
app.use(express.json());

/*
app.post("/register", async (req,res) =>{
    const { username, password } = req.body
    try{
        const newUser = await User.create({username:username,password:password})
        res.status(201).json({message:"Création Succès",newUser})
    }catch(err){
        res.status(401).json({error:"Erreur :"+err})
    }
    
})

app.post("/logins",(req,res)=>{
    const { username } = req.body;

    req.session.user = {username}

    res.json({ message: "Logged in", user: req.session.user });
})*/

app.get("/me", isAuthenticated ,(req, res) => {

  if (!req.session.user) return res.status(401).json({ error: "Not logged" });

  res.json({ user: req.session.user });

});

app.post("/logout", (req, res) => {

  req.session.destroy(() => {

    res.clearCookie("connect.sid");

    res.json({ message: "Logged out" });

  });

});
app.use("/auth",authRoutes)
app.use("/types",typesRoutes)
app.use("/pokemon",pokemonRoutes)


export default app;