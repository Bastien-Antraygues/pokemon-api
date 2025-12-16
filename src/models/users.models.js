import mongoose from "mongoose";

import bcrypt from "bcrypt";

 

const userSchema = new mongoose.Schema({

  email: { type: String, unique: true, required: true },

  password: { type: String},

  name: String,

  googleId: { type: String, unique: true, sparse: true }, // utile si un user log un jour via Google

  createdAt: { type: Date, default: Date.now }

});
// Méthode pour vérifier un mot de passe
userSchema.methods.checkPassword = function (password) {

  return bcrypt.compare(password, this.password);

};

export default mongoose.model("User", userSchema);

/*
const UserSchema = new mongoose.Schema({
    username: { type:String, required:true },
    password: {type:String, required:true}
})

const transform = (_doc, ret) => {
    delete: _id
}

export const User = mongoose.model("User", UserSchema)*/