export function pokemonDto(pokemon){
    return {
        id:pokemon.id,
        name: pokemon.name,
        order: pokemon.order,
        sprites: pokemon.sprites,
        stats:pokemon.stats,
        types: pokemon.types?.map(t => ({type:{
            id:t.type._id,
            name:t.type.name
        }})),
        abilities: pokemon.abilities?.map(a => ({
            ability : {
                name: a.ability.name,
                effect_entries: a.ability.effect_entries,
                flavor_text_entries: a.ability.flavor_text_entries,
                names: a.ability.names
            }
        }))
    }
}

export function pokemonListDto(pokemon){
    return {
        id:pokemon.id,
        name:pokemon.name,
        order:pokemon.order,
        sprites: pokemon.sprites,
        types: pokemon.types?.map(t => ({type:{
            id:t.type._id,
            name:t.type.name
        }}))
    }
}