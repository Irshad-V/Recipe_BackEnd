
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const path = require('path');
require("dotenv").config()
const bodyParser = require('body-parser');


app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));
const { UserRouter } = require("./src/routes/Users")
const { RecipesRouter } = require("./src/routes/Recipes")



app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use("/auth", UserRouter)
app.use("/recipes", RecipesRouter)


mongoose.connect(process.env.Db_url)
    .then(() => console.log("Mongodb connect"))
    .catch(err => console.log("mongoose connection err:", err))




app.listen(process.env.PORT || 3001, () => console.log("server started"))