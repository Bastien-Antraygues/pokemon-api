import express from "express";
import getPokemonByName from "./getPokemonByName.js";
import getAllPokemon from "./getAllPokemon.js";
const router = express.Router();

router.get("/all",getAllPokemon)
router.get("/:name",getPokemonByName)


export default router