import { favoriteDto } from "../../dto/favorites.dto.js";
import Favorites from "../../models/favorites.models.js";

export default async (req,res) => {
    const userid = req.user.id;
    const favorites = await Favorites.findOne({ userId: userid })
    .populate({
        path: "pokemonFavorites.pokemonId",
        populate: [
            {
                path: "types.type",
                model: "Type",
                select: "name"
            },
            {
                path: "abilities.ability",
                model: "Ability",
                select: "name"
            }
        ]
    })
    if(!favorites) return res.status(404).json({ error: "No favorites found for this user" });
    return res.json(favoriteDto(favorites));
}