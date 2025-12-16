import mongoose from "mongoose";

const typeSchema = mongoose.Schema({
    name:{type:String, require:true,unique:true},
    damage_relation:{
        double_damage_from:[{
            type: mongoose.Schema.Types.ObjectId, ref:"Type"
        }],
        double_damage_to:[{
            type: mongoose.Schema.Types.ObjectId, ref:"Type"
        }],
        half_damage_from:[{
            type: mongoose.Schema.Types.ObjectId, ref:"Type"
        }],
        half_damage_to:[{
            type: mongoose.Schema.Types.ObjectId, ref:"Type"
        }],
        no_damage_from:[{
            type: mongoose.Schema.Types.ObjectId, ref:"Type"
        }],
        no_damage_to:[{
            type: mongoose.Schema.Types.ObjectId, ref:"Type"
        }]
    }
});

export default mongoose.model("Type", typeSchema);