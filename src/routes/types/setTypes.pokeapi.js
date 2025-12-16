import  Type  from "../../models/types.models.js"

export default async (req, res)=>{
    try {
        console.log(process.env.POKE_API_URL)
        const response = await fetch(process.env.POKE_API_URL+"type/")
        const data = await response.json();
        data.results.map((objet)=>{
            const id = objet.url.split("/").filter(Boolean).pop()
            console.log(objet.name+" "+id)
            Type.create({name:objet.name})
        })
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error,message:"Erreur serveur"})
    }
}