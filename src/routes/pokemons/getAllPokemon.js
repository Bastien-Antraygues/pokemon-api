import { pokemonListDto } from "../../dto/pokemon.dto.js";
import pokemonModels from "../../models/pokemon.models.js"

export default async (req,res) => {
    const pokemons = await pokemonModels.find()
    .populate("types.type","name")
    .lean()
    if (!pokemons || pokemons.length === 0) {
        return res.json([]);
    }
    const pokemonsDto = pokemons.map(pokemonListDto)

    res.json(pokemonsDto)
}