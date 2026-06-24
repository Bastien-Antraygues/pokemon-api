import Favorites from "../../models/favorites.models.js";

export default async (req,res) => {
    const userid = req.user.id;
    const { pokemonId } = req.body;
    let noFavorite = false;
    let favorites = await Favorites.findOne({ userId: userid });
    if(!favorites) {
        favorites = new Favorites({ userId: userid, pokemonFavorites: [] });
        noFavorite = true;
    }
    if(noFavorite) {
        favorites.pokemonFavorites.push({ pokemonId, order: 1 });
    }
    else {
        const existingFavoriteIndex = favorites.pokemonFavorites.findIndex(fav => fav.pokemonId.toString() === pokemonId);
        if(existingFavoriteIndex == -1){
            favorites.pokemonFavorites.push({ pokemonId, order: favorites.pokemonFavorites.length + 1 });
        }else{
            favorites.pokemonFavorites.splice(existingFavoriteIndex, 1);
        }
    }
    const savedFavorites = await favorites.save();
    return res.json({ favorites: savedFavorites });
}