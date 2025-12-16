import express from "express";
import setTypesPokeapi from "./setTypes.pokeapi.js";

const router = express.Router();

router.get("/pokeapi",setTypesPokeapi)

export default router;