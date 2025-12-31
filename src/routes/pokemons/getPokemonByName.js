import { pokemonDto } from "../../dto/pokemon.dto.js"
import pokemonModels from "../../models/pokemon.models.js"

export default async (req,res)=>{
    
    const pokemon = await pokemonModels.findOne({name:req.params.name})
    .populate("types.type","name")
    .populate("abilities.ability")
    .lean()
    if(!pokemon) return res.status(404).json({error:"Pokemon Not found"})
    res.json(pokemonDto(pokemon))
}