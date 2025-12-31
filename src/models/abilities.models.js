import mongoose, { mongo } from "mongoose";

const abilitySchema = new mongoose.Schema({
    name: { type:String, require:true, unique:true},
    effect_entries:[{
        effect: {type:String},
        language:{
            name:String
        }
    }],
    flavor_text_entries:[
        {
            flavor_text:String,
            language:{
                name:String
            }
        }
    ],
    names:[{
        language:{
            name:String
        },
        name:String
    }]
})
export default mongoose.model("Ability",abilitySchema)