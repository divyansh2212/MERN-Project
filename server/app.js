const express = require("express")
const dotenv = require("dotenv")
const app = express()

dotenv.config({ path: './config.env' })
const port = process.env.PORT

require('./db/conn')
const User = require('./models/schema')

// middlewares

const middelware = (req, res, next) => {
    console.log("This is middleware");
    next();
}
app.use(express.json())
app.use(require("./router/auth"))

app.get("/", (req, res) => {
    res.send("Hello from the home side")
})

app.get("/about", middelware, (req, res) => {
    console.log("about");
    res.send("About page")
})

app.get("/contact", (req, res) => {
    res.send("Contact page")
})

app.get("/signin", (req, res) => {
    res.send("signin page")
})

app.get("/signup", (req, res) => {
    res.send("signup page")
})

app.listen(port, () => {
    console.log(`Listening at the port ${port}`);
})