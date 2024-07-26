const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({

    firstName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    savedRecipe:[ { type: mongoose.Schema.ObjectId ,ref:"Recipes"}]

})
const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel