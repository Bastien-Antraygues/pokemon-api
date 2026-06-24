import favoritesModels from "../../models/favorites.models.js";

export default async (req,res) => {
    const userId = req.user.id;
    const favorite = await favoritesModels.findOne({userId: userId})
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
    .lean();
    if(!favorite) return res.json({ pokemonFavorite: [] })
    const pokemonFavorites = favorite.pokemonFavorites.map(fav => ({
    pokemon: fav.pokemonId,
    order: fav.order,
    _id: fav._id
    }))
    return res.json({ pokemonFavorite: pokemonFavorites })
}