import mongoose from "mongoose"

const favoritesSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    pokemonFavorites:[
        {
            pokemonId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Pokemon",
                required:true
            },
            order: Number
        }
    ]
})

export default mongoose.model("Favorite", favoritesSchema)