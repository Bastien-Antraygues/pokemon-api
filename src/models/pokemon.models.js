import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
    name: {type: String, required: true, unique:true},
    abilities: [
        {
            ability:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Ability",
                required:true
            }
        }
    ],
    sprites:{
        front_default:{type:String,required:true},
        back_default:String
    },
    stats:[
        {
            base_stat:Number,
            effort:Number,
            stat:{
                name:String
            }
        }
    ],
    types: [
        {
            type:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Type",
                required:true
            }
        }
    ],
    order: Number
})

export default mongoose.model("Pokemon", PokemonSchema);