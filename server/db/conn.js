const mongoose = require('mongoose')

const db = process.env.DATABASE
mongoose.connect(db).then(() => console.log("db connection successful")).catch((e) => console.log(e))