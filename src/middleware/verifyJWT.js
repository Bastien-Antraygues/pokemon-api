import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if(!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Accès refusé : token manquant" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Accès refusé : token invalide" });
    req.user = decoded.user;
    next();
  });

};