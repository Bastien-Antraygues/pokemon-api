
import { connectToDatabase } from "./src/db/mongo.js";

import app from "./app.js";
import Pokemon from "./src/models/pokemon.models.js"
import { fillDB } from "./src/db/fillDB.js";

const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pokemonDB"



async function start() {
  

  app.listen(PORT, ()=>{
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
  })
}
async function init() {
  await connectToDatabase(MONGO_URI)
  Pokemon.findOne().then(async (pokemon)=>{
    if(!pokemon){
      await fillDB();
    }
    start()
  })
  
}
init();