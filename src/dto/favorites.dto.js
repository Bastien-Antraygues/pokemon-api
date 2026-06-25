export function favoriteDto(favorite){
    return {
        id: favorite._id,
        userId: favorite.userId,
        pokemonFavorites: favorite.pokemonFavorites?.map(f => ({
            pokemon : {
                id: f.pokemonId._id,
                name: f.pokemonId.name,
                order: f.pokemonId.order,
                sprites: f.pokemonId.sprites,
                stats: f.pokemonId.stats,
                types: f.pokemonId.types?.map(t => ({type:{
                    id:t.type._id,
                    name:t.type.name
                }})),
                abilities: f.pokemonId.abilities?.map(a => ({
                    ability : {
                        name: a.ability.name,
                        effect_entries: a.ability.effect_entries,
                        flavor_text_entries: a.ability.flavor_text_entries,
                        names: a.ability.names
                    }
                }))
            },
            order: f.order
        }))
    }
}