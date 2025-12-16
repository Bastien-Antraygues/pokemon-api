import mongoose from "mongoose";

mongoose.set("strictQuery", true); // Option recommandée

export async function connectToDatabase(uri){
    try{
        await mongoose.connect(uri, {
            maxPoolSize: 10, // pour éviter trop de connexions simultanées
            serverSelectionTimeoutMS: 5000
        });

    console.log("✓ MongoDB connecté");

    return mongoose.connection;

    } catch(err){
        console.error("✗ Erreur de connexion MongoDB :", err.message)

        process.exit(1); // On arrête tout : connexion DB obligatoire
    }
}

