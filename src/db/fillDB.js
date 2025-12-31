import typesModels from "../models/types.models.js";
import abilitiesModels from "../models/abilities.models.js";
import pokemonModels from "../models/pokemon.models.js";

export async function fillDB(){
    try {
            console.log("Début d'initialisation de la base de donnée")
            await typesModels.deleteMany({})
            await abilitiesModels.deleteMany({})

            // Ability
            console.log("Ajout des Abilities en cours")
            const resPokeAbility = await fetch(process.env.POKE_API_URL+"ability/?offset=0&limit=367")
            const pokeAbility = await resPokeAbility.json()
            
            for(const pokeA of pokeAbility.results){
                const pokeability = await fetch(process.env.POKE_API_URL+"ability/"+pokeA.name)
                const resA = await pokeability.json()
                await abilitiesModels.create(resA)
            }
            console.log("Fin d'ajout des Abilities")
            console.log("Ajotu des Types en cours")
            const response = await fetch(process.env.POKE_API_URL+"type/")
            const data = await response.json();

            // Type creation à partir de pokeapi
            for (const objet of data.results) {
                await typesModels.create({name:objet.name})
                
            }
            console.log("Fin de creation des Types")
            const tabAbility = await abilitiesModels.find({}).lean()
            const tab = await typesModels.find({}).lean()
            // Mappeur clé : valeur fire : idFire
            const abilityMap = {};
            const typeMap = {};
            for(const t of tabAbility){
                abilityMap[t.name] = t._id;
            }
            for (const t of tab) {
                typeMap[t.name] = t._id;
            }

            // Fonction qui retourne une liste de ID à partir du type.nom
            const mapNamesToIdsAbility = (arr) => {
                return arr.map(a => {
                    const abilityId = abilityMap[a.ability.name]
                    if(!abilityId) return null
                    return {
                        ability: abilityId
                    }
                }).filter(Boolean)
            }
            const mapNamesToIdsType = (arr) => {
                return arr.map(t => {
                    const typeId = typeMap[t.type.name]
                    if(!typeId) return null
                    return {
                        type: typeId
                    }
                })
            }
            const mapNamesToIds = (arr) => {
            return arr
                .map(t => typeMap[t.name])
                .filter(Boolean); // sécurité
            };
            console.log("Debut d'ajout de damageRelation entre type")
            // Type update damageRelation pour chaque type
            for (const objet of tab){
                const typeResponse = await fetch(process.env.POKE_API_URL+"type/"+objet.name);
                const type = await typeResponse.json();
                const damageRelations = {
                    double_damage_from: mapNamesToIds(type.damage_relations.double_damage_from),
                    double_damage_to: mapNamesToIds(type.damage_relations.double_damage_to),
                    half_damage_from: mapNamesToIds(type.damage_relations.half_damage_from),
                    half_damage_to: mapNamesToIds(type.damage_relations.half_damage_to),
                    no_damage_from: mapNamesToIds(type.damage_relations.no_damage_from),
                    no_damage_to: mapNamesToIds(type.damage_relations.no_damage_to),
                };
                await typesModels.findByIdAndUpdate(
                    objet._id,
                    { damage_relation: damageRelations },
                    { new: true }
                );
            }
            console.log("Fin d'ajout de damageRelation Entre Type")
            
            console.log("Ajout des pokemons en cours")
           const resPokemonList = await fetch(process.env.POKE_API_URL+"pokemon/?offset=0&limit=1350") // 1350
           const listPoke = await resPokemonList.json()
           for(const pokeUrl of listPoke.results){
            const resPokemon = await fetch(process.env.POKE_API_URL+"pokemon/"+pokeUrl.name)
            const pokemon = await resPokemon.json()
            const stats = []
            const abilities = mapNamesToIdsAbility(pokemon.abilities)
            const types = mapNamesToIdsType(pokemon.types)

            for(const stat of pokemon.stats){
                stats.push(
                    {
                        base_stat:stat.base_stat,
                        effort:stat.effort,
                        stat:{
                            name:stat.stat.name
                        }
                    }
                )
            }
            const newPoke = {
                name:pokemon.name,
                sprites:{
                    front_default:pokemon.sprites.front_default,
                    back_default:pokemon.sprites.back_default
                },
                abilities:abilities,
                types:types,
                stats:stats,
                order:pokemon.order
            } 
            await pokemonModels.create(newPoke)
            
           }
           console.log("Fin d'ajout des pokemons")
           console.log("Fin de l'initialisation de la base de donnée")
            
        } catch (error) {
            console.log(error)
        }
}