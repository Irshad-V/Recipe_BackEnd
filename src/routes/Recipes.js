const express = require("express")
const router = express.Router()
const app = express()
const RecipesModel = require('../models/RecipesSchema')
const UserModel = require("../models/UserSchema")
const { verifyToken } = require("../middleware/middle")

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const nameWithoutSpaces = originalName.replace(/\s+/g, '_');
        const timestamp = Date.now();
        const uploadName = `${timestamp}_${nameWithoutSpaces}`;
        cb(null, uploadName);
    }
});

const upload = multer({ storage: storage });

// to get all recipe for home page
router.get("/", async (req, res) => {
    try {
        const AllRecipes = await RecipesModel.find({})
        res.status(200).json(AllRecipes)

    } catch (err) {
        res.status(500).json(err)
    }

})

// create Recipe , only logged user can create recipe, and used multer for image upload

router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    const { name, ingredients, instructions, cookingTime, userOwner } = req.body;

    const newRecipe = new RecipesModel({
        name,
        image: req.file ? req.file.filename : null,
        ingredients,
        instructions,
        cookingTime,
        useremail: req.body.useremail,
        username: req.body.username,
        userOwner,

    });

    try {
        const result = await newRecipe.save()
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err, "meeee")
    }
})
//editing for created recipe

router.put("/:recipeId", verifyToken, upload.single('image'), async (req, res) => {

    const Id = req.params.recipeId
    const { name, ingredients, instructions, cookingTime, userOwner, image, useremail, username } = req.body;
    try {
        const updateData = {
            name,
            ingredients,
            instructions,
            cookingTime,
            useremail,
            username,
            userOwner
        };

        if (req.file) {
            updateData.image = req.file.filename;
        } else if (image) {
            updateData.image = image;
        }

        const result = await RecipesModel.findByIdAndUpdate(
            Id,
            { $set: updateData },
            { new: true }
        );
        res.status(200).json({ result });
    } catch (err) {
        res.status(500).json(err);
    }
});

// to get each recipe 
router.get("/:recipeId", async (req, res) => {
    const Id = req.params.recipeId
    try {
        const result = await RecipesModel.findById({ _id: Id });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

// to delete each recipe 
router.delete("/:recipeId", verifyToken, async (req, res) => {
    const Id = req.params.recipeId
    try {
        const result = await RecipesModel.deleteOne({ _id: Id });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

// to save recipe
router.put("/", verifyToken, async (req, res) => {

    const { userId, recipeId } = req.body

    try {
        const result = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { savedRecipe: recipeId } },
            { new: true });
        const Saveddata = result.savedRecipe
        res.status(200).json({ Saveddata });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//delte saved recipe



// get saved recipes for logged user, 
router.get("/savedRecipes/:userId", async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.userId);
        const savedRecipes = await RecipesModel.find({
            _id: { $in: user.savedRecipe },
        });

        res.status(201).json({ savedRecipes });
    } catch (err) {
        res.status(500).json(err);
    }
});

//this for checking which recipie is saved ,
router.get("/savedRecipes/allId/:userId", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        res.status(201).json({ savedRecipes: user?.savedRecipe });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//to get user created recipies only
router.get("/createdRecipe/user/:userId", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const createdRecipes = await RecipesModel.find({
            userOwner: { $in: req.params.userId },
        });
        res.status(200).json(createdRecipes);
    } catch (err) {
        console.log(err);

        res.status(500).json(err);
    }
});



//deleting saved recipes

router.delete('/users/:userID/savedRecipes/:recipeId', verifyToken, async (req, res) => {
    const { userID, recipeId } = req.params;
    console.log(userID, recipeId);

    try {
        await UserModel.findByIdAndUpdate(
            userID,
            { $pull: { savedRecipe: recipeId } },
            { new: true }
        );
        res.status(200).send({ message: 'Recipe ID deleted successfully' });
    } catch (error) {
        console.log("eroorr update");
        res.status(500).send({ error: 'Error deleting recipe ID' });
    }
});





exports.RecipesRouter = router;

