import typesModels from "../models/types.models.js";

export async function fillDB(){
    try {
            await typesModels.deleteMany({})
            const response = await fetch(process.env.POKE_API_URL+"type/")
            const data = await response.json();
            for (const objet of data.results) {
                await typesModels.create({name:objet.name})
                
            }
            const tab = await typesModels.find({}).lean()
            for (const objet of tab){
                //await typesModels.findByIdAndUpdate()
            }
            console.log(tab)
                /*await typesModels.findOne({name:objet.name}).then(async(element)=>{
                    const response = await fetch(process.env.POKE_API_URL+"type/"+objet.name)
                    const data = await response.json()
                    
                })*/
           
            
        } catch (error) {
            console.log(error)
        }
}