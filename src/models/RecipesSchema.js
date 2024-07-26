const mongoose = require("mongoose")


const RecipesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    ingredients: [
        {
            type: String,
            required: true,
        },
    ],
    instructions: {
        type: String,
        required: true,
    },

    cookingTime: {
        type: Number,
        required: true,
    },
    useremail:{
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },


})





const RecipesModel = mongoose.model("Recipes", RecipesSchema);
module.exports = RecipesModel