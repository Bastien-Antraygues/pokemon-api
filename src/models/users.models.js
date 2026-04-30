import mongoose from "mongoose";

import bcrypt from "bcrypt";

 

const userSchema = new mongoose.Schema({

  email: { 
    type: String, 
    unique: true, 
    required: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide'] 
  },

  password: { type: String, required: true },

  firstname: {
    type: String,
    required: [true, 'Le prenom est requis'],
    trim: true,
    minlength: [2, 'Le prenom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le prenom ne peut pas dépasser 50 caractères']
  },
  lastname:{
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {type: String,unique: true},
  createdAt: { type: Date, default: Date.now }

});
// Méthode pour vérifier un mot de passe
userSchema.methods.checkPassword = async function (password) {

  return bcrypt.compare(password, this.password);

};
userSchema.methods.fullName = function () {
  return this.firstname + ' ' + this.lastname;
}
userSchema.methods.toJSON = function () {
  const obj = this.toObject();  
  delete obj.password; // on supprime le mot de passe de l'objet retourné
  return obj;
};
export default mongoose.model("User", userSchema);
